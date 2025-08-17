import type { 
  Cosmology, 
  Question, 
  ConvictionProfile, 
  QuestionScore, 
  QuestionBonuses,
  QuizAnswer 
} from '~/types'
import { CONFIG } from '~/types'

export const useQuestionScoring = () => {
  
  const checkForTiedCosmologies = (
    topCosmologies: Array<Cosmology & { score: number, rank: number }>
  ): boolean => {
    if (topCosmologies.length < CONFIG.TIE_BREAKING_MIN_TIED) return false
    
    const highestScore = topCosmologies[0].score
    let tiedCount = 0
    
    for (const cosmology of topCosmologies) {
      if (Math.abs(cosmology.score - highestScore) <= CONFIG.TIE_SCORE_THRESHOLD) {
        tiedCount++
      } else {
        break // Once we hit a non-tied cosmology, stop counting
      }
    }
    
    return tiedCount >= CONFIG.TIE_BREAKING_MIN_TIED
  }
  
  const calculateDifferentiationScore = (
    questionKey: string,
    topCosmologies: Array<Cosmology & { score: number, rank: number }>
  ): { differentiationScore: number, differentiationEfficiency: number, boostedCount: number, requiredQuestionBoost: number, requiredCosmologyMatches: number } => {
    // Count how many top cosmologies would be boosted by this question
    const boostedCosmologies = topCosmologies.filter(c => 
      c[questionKey] === 'R' || c[questionKey] === 'DB'
    )
    const boostedCount = boostedCosmologies.length
    
    if (topCosmologies.length === 0) {
      return { differentiationScore: 0, differentiationEfficiency: 0, boostedCount: 0, requiredQuestionBoost: 0, requiredCosmologyMatches: 0 }
    }
    
    // Calculate boost ratio (what percentage of top cosmologies get boosted)
    const boostRatio = boostedCount / topCosmologies.length
    
    // Differentiation efficiency peaks at 0.5 (50% split), drops toward 0.0 and 1.0
    // This creates a bell curve: 1.0 at 50%, 0.0 at 0% or 100%
    const differentiationEfficiency = 1 - Math.abs(0.5 - boostRatio) * 2
    
    // Calculate weighted boost potential (higher ranked cosmologies get more weight)
    const weightedBoostPotential = boostedCosmologies.reduce((sum, c) => {
      const rankWeight = (topCosmologies.length + 1 - c.rank) / topCosmologies.length
      const pointsForBoost = c[questionKey] === 'R' ? CONFIG.POINTS_PER_REQUIRED : CONFIG.POINTS_PER_DEAL_BREAKER
      return sum + (pointsForBoost * rankWeight)
    }, 0)
    
    // Calculate Required Question Boost for lower-ranked cosmologies (part of differentiation)
    let requiredQuestionBoost = 0
    let requiredCosmologyMatches = 0
    
    if (CONFIG.REQUIRED_QUESTION_BOOST_ENABLED) {
      // Consider cosmologies within the specified range (e.g., ranks 1-30)
      const rangeCosmologies = topCosmologies.slice(0, CONFIG.REQUIRED_QUESTION_BOOST_RANGE)
      
      // Find cosmologies that Require this question
      const requiredMatches = rangeCosmologies.filter(c => c[questionKey] === 'R')
      requiredCosmologyMatches = requiredMatches.length
      
      if (requiredCosmologyMatches > 0) {
        // Calculate weighted boost - LOWER ranked cosmologies get MORE boost
        const weightedBoost = requiredMatches.reduce((sum, cosmology) => {
          // Lower-ranked cosmologies need more help: boost factor increases with rank
          // Rank 1 gets base boost, rank 20 gets much higher boost
          const rankBoostMultiplier = 1 + (cosmology.rank - 1) * CONFIG.REQUIRED_QUESTION_RANK_BOOST_FACTOR
          return sum + rankBoostMultiplier
        }, 0)
        
        // Scale the boost by base points
        requiredQuestionBoost = weightedBoost * CONFIG.REQUIRED_QUESTION_BOOST_SCALE
      }
    }
    
    // Combine traditional differentiation with Required Question Boost
    const baseDifferentiationScore = weightedBoostPotential * differentiationEfficiency * 15
    const totalDifferentiationScore = baseDifferentiationScore + requiredQuestionBoost
    
    return { 
      differentiationScore: totalDifferentiationScore, 
      differentiationEfficiency, 
      boostedCount,
      requiredQuestionBoost,
      requiredCosmologyMatches
    }
  }
  
  
  const scoreQuestion = (
    questionKey: string,
    question: Question,
    activeCosmologies: Cosmology[],
    convictionProfile: ConvictionProfile,
    askedConcepts: string[],
    dontKnowCount: number,
    topCosmologies?: Array<Cosmology & { score: number, rank: number }>,
    tieBreakerMode?: boolean
  ): QuestionScore => {
    // Calculate basic eliminations
    const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length
    const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length
    const productScore = yesEliminated * noEliminated

    // Calculate answer probabilities based on user profile
    const [pYes, pNo] = estimateAnswerProbabilities(question, convictionProfile)

    // Information theory modifier (entropy)
    let entropyModifier = 0.0
    if (pYes > CONFIG.MIN_PROBABILITY && pNo > CONFIG.MIN_PROBABILITY) {
      entropyModifier = -((pYes * Math.log2(pYes)) + (pNo * Math.log2(pNo)))
    }

    // Calculate bonuses
    const bonuses = calculateQuestionBonuses(question, convictionProfile, askedConcepts)

    // Uncertainty handling bonus
    let uncertaintyBonus = 1.0
    if (dontKnowCount >= 2) {
      // Prefer questions that are clearer/more concrete
      if (question.clarification && question.clarification.length > 50) {
        uncertaintyBonus = CONFIG.UNCERTAINTY_BONUS
      }
    }

    // Apply predictable question penalty
    let predictablePenalty = 1.0
    if (pYes < 0.2 || pYes > 0.8) {
      predictablePenalty = CONFIG.PREDICTABLE_QUESTION_PENALTY
    }
    
    // Calculate differentiation score (includes Required Question Boost) if top cosmologies are provided
    let differentiationScore = 0
    let differentiationEfficiency = 0
    let boostedCount = 0
    let requiredQuestionBoost = 0
    let requiredCosmologyMatches = 0
    
    if (topCosmologies && topCosmologies.length > 0) {
      const diffResult = calculateDifferentiationScore(questionKey, topCosmologies)
      differentiationScore = diffResult.differentiationScore
      differentiationEfficiency = diffResult.differentiationEfficiency
      boostedCount = diffResult.boostedCount
      requiredQuestionBoost = diffResult.requiredQuestionBoost
      requiredCosmologyMatches = diffResult.requiredCosmologyMatches
    }
    
    // Determine game phase and weights based on remaining cosmologies and tie-breaker mode
    const remaining = activeCosmologies.length
    let eliminationWeight: number
    let differentiationWeight: number
    let entropyWeight: number
    
    // Check if we're in tie-breaker mode or should enter it
    const shouldEnterTieBreaker = topCosmologies && topCosmologies.length >= 2 && 
      CONFIG.TIE_BREAKING_MODE_ENABLED &&
      checkForTiedCosmologies(topCosmologies) && 
      (remaining <= CONFIG.LATE_GAME_THRESHOLD || tieBreakerMode)
    
    if (shouldEnterTieBreaker || tieBreakerMode) {
      // Tie-breaker mode: focus purely on differentiation (includes Required Question Boost), ignore elimination
      eliminationWeight = 0.0
      differentiationWeight = 0.9
      entropyWeight = 0.1
    } else if (remaining > CONFIG.EARLY_GAME_THRESHOLD) {
      // Early game: prioritize elimination
      eliminationWeight = CONFIG.ELIMINATION_WEIGHT_EARLY
      differentiationWeight = CONFIG.DIFFERENTIATION_WEIGHT_EARLY
      entropyWeight = CONFIG.ENTROPY_WEIGHT_EARLY
    } else if (remaining > CONFIG.LATE_GAME_THRESHOLD) {
      // Mid game: balance elimination and differentiation
      eliminationWeight = CONFIG.ELIMINATION_WEIGHT_MID
      differentiationWeight = CONFIG.DIFFERENTIATION_WEIGHT_MID
      entropyWeight = CONFIG.ENTROPY_WEIGHT_MID
    } else {
      // Late game: prioritize differentiation
      eliminationWeight = CONFIG.ELIMINATION_WEIGHT_LATE
      differentiationWeight = CONFIG.DIFFERENTIATION_WEIGHT_LATE
      entropyWeight = CONFIG.ENTROPY_WEIGHT_LATE
    }

    // Combine all factors with dynamic weights
    // Note: differentiationScore now includes Required Question Boost
    const eliminationScore = productScore * bonuses.totalBonus * predictablePenalty
    const entropyScore = entropyModifier * 100 // Scale entropy to be comparable
    
    const totalScore = (
      eliminationScore * eliminationWeight +
      differentiationScore * differentiationWeight +
      entropyScore * entropyWeight
    ) * uncertaintyBonus

    return {
      totalScore,
      productScore,
      entropyModifier,
      bonuses,
      uncertaintyBonus,
      predictablePenalty,
      pYes,
      pNo,
      yesEliminated,
      noEliminated,
      potentialEliminations: yesEliminated + noEliminated,
      differentiationScore,
      differentiationEfficiency,
      boostedCount,
      requiredQuestionBoost,
      requiredCosmologyMatches
    }
  }

  const estimateAnswerProbabilities = (
    question: Question,
    convictionProfile: ConvictionProfile
  ): [number, number] => {
    let pYes = 0.5
    let totalEvidence = 0
    let yesEvidence = 0

    for (const concept of question.concepts) {
      const tag = concept.tag
      const polarity = concept.polarity

      if (tag in convictionProfile) {
        const proCount = convictionProfile[tag].pro
        const conCount = convictionProfile[tag].con

        totalEvidence += proCount + conCount

        if (polarity === 'pro') {
          yesEvidence += proCount
        } else {
          yesEvidence += conCount
        }
      }
    }

    // Update probability based on evidence
    if (totalEvidence > 0) {
      pYes = yesEvidence / totalEvidence
      // Don't let it get too extreme
      pYes = Math.max(CONFIG.MIN_PROBABILITY, Math.min(1 - CONFIG.MIN_PROBABILITY, pYes))
    }

    return [pYes, 1 - pYes]
  }

  const calculateQuestionBonuses = (
    question: Question,
    convictionProfile: ConvictionProfile,
    askedConcepts: string[]
  ): QuestionBonuses => {
    let consistencyBonus = 1.0
    let convictionPenalty = 1.0
    let drillDownBonus = 1.0
    let noveltyBonus = 1.0

    // Apply original bonus logic
    for (const concept of question.concepts) {
      const tag = concept.tag
      const polarity = concept.polarity

      // Consistency bonus
      if (tag in convictionProfile) {
        const profile = convictionProfile[tag]
        const currentPolarity = profile[polarity] || 0
        const oppositePolarity = profile[polarity === 'pro' ? 'con' : 'pro'] || 0

        if (currentPolarity === 0 && oppositePolarity > 0) {
          consistencyBonus = CONFIG.CONSISTENCY_BONUS
        }

        // Conviction penalty
        if (currentPolarity >= CONFIG.STRONG_STANCE_THRESHOLD && oppositePolarity === 0) {
          convictionPenalty = 1 / CONFIG.CONVICTION_PENALTY_FACTOR
        }

        // Drill down bonus
        if (profile.pro + profile.con === 1) {
          drillDownBonus = CONFIG.DRILL_DOWN_BONUS
        }
      }
    }

    // Novelty bonus
    const questionConceptTags = question.concepts.map(c => c.tag)
    const hasNovelConcepts = questionConceptTags.some(tag => !askedConcepts.includes(tag))
    if (hasNovelConcepts) {
      noveltyBonus = CONFIG.NOVELTY_BONUS
    }

    const totalBonus = consistencyBonus * noveltyBonus * convictionPenalty * drillDownBonus

    return {
      totalBonus,
      consistencyBonus,
      convictionPenalty,
      drillDownBonus,
      noveltyBonus
    }
  }

  const processAnswer = (
    questionKey: string,
    answer: QuizAnswer,
    cosmologies: Cosmology[],
    scores: number[]
  ): { 
    eliminated: Array<{name: string, category: string}>, 
    newScores: number[],
    boosted: Array<{name: string, points: number, reason: string}>
  } => {
    const eliminated: Array<{name: string, category: string}> = []
    const boosted: Array<{name: string, points: number, reason: string}> = []
    const newScores = [...scores]

    // Define skeptical/agnostic cosmologies that embrace uncertainty
    // Most skeptical cosmologies get moderate uncertainty boost
    const coreSkepticalCosmologies = new Set([
      'Transitional Seeking', 'Philosophical Spirituality', 'Pragmatic Spirituality'
    ])
    
    // Ultra-skeptical cosmologies get highest uncertainty boost (all forms of agnosticism and skepticism)
    const ultraSkepticalCosmologies = new Set([
      'Open Skeptic', 'Mystical Agnosticism', 'Epistemological Agnosticism', 'Perpetual Inquiry'
    ])

    if (answer === '?') {
      cosmologies.forEach((cosmology, i) => {
        const cosmologyName = cosmology.Cosmology
        const relation = cosmology[questionKey]
        const isEliminated = newScores[i] <= CONFIG.SCORE_ELIMINATE
        
        // Boost ultra-skeptical cosmologies most for "don't know" answers
        if (ultraSkepticalCosmologies.has(cosmologyName)) {
          if (!isEliminated) {
            newScores[i] += 5 // Highest boost for most uncertainty-embracing worldviews
            boosted.push({ name: cosmologyName, points: 5, reason: "Ultra-skeptical cosmology + Don't Know answer" })
          }
        }
        // Boost other core skeptical/agnostic cosmologies
        else if (coreSkepticalCosmologies.has(cosmologyName)) {
          if (!isEliminated) {
            newScores[i] += 4 // Moderate boost for philosophies that embrace epistemic humility
            boosted.push({ name: cosmologyName, points: 4, reason: "Core skeptical cosmology + Don't Know answer" })
          }
        }
        // Also boost all other cosmologies that are "comfortable with uncertainty"
        else if (cosmology['Comfortable with uncertainty'] === 'R') {
          if (!isEliminated) {
            newScores[i] += 2 // Smaller boost for uncertainty-friendly worldviews
            boosted.push({ name: cosmologyName, points: 2, reason: "Comfortable with uncertainty + Don't Know answer" })
          }
        }
        // Apply penalty to cosmologies that require definite beliefs on this topic
        else if (relation === 'R') {
          // Even eliminated cosmologies continue to lose points for requiring certainty
          newScores[i] += CONFIG.UNCERTAINTY_PENALTY // -2 points for requiring certainty
        }
      })
      return { eliminated, newScores, boosted }
    }

    cosmologies.forEach((cosmology, i) => {
      const relation = cosmology[questionKey]
      const cosmologyName = cosmology.Cosmology
      const category = cosmology.Category
      const isEliminated = newScores[i] <= CONFIG.SCORE_ELIMINATE

      if (answer === 'Y') {
        if (relation === 'R') {
          if (!isEliminated) {
            newScores[i] += 10
            boosted.push({ name: cosmologyName, points: 10, reason: "YES answer to Required question" })
          } else {
            newScores[i] += 5 // Eliminated cosmologies can still gain points for compatible aspects
          }
        } else if (relation === 'NR') {
          if (!isEliminated) {
            newScores[i] += 3
            boosted.push({ name: cosmologyName, points: 3, reason: "YES answer to Not Required question" })
          } else {
            newScores[i] += 2 // Smaller gain for eliminated cosmologies
          }
        } else if (relation === 'DB') {
          // First elimination sets to -1000, subsequent hits continue decreasing
          if (!isEliminated) {
            newScores[i] = CONFIG.SCORE_ELIMINATE
            eliminated.push({ name: cosmologyName, category })
          } else {
            newScores[i] -= 10 // Continue losing points after elimination
          }
        }
      } else if (answer === 'N') {
        if (relation === 'R') {
          // First elimination sets to -1000, subsequent hits continue decreasing
          if (!isEliminated) {
            newScores[i] = CONFIG.SCORE_ELIMINATE
            eliminated.push({ name: cosmologyName, category })
          } else {
            newScores[i] -= 10 // Continue losing points after elimination
          }
        } else if (relation === 'NR') {
          if (!isEliminated) {
            newScores[i] += 3
            boosted.push({ name: cosmologyName, points: 3, reason: "NO answer to Not Required question" })
          } else {
            newScores[i] += 2 // Eliminated cosmologies can still gain points
          }
        } else if (relation === 'DB') {
          if (!isEliminated) {
            newScores[i] += 10
            boosted.push({ name: cosmologyName, points: 10, reason: "NO answer to Deal Breaker question" })
          } else {
            newScores[i] += 5 // Eliminated cosmologies can gain points for compatible aspects
          }
        }
      }
    })

    return { eliminated, newScores, boosted }
  }

  // Removed isSubset helper - now using array methods

  return {
    scoreQuestion,
    estimateAnswerProbabilities,
    calculateQuestionBonuses,
    processAnswer,
    calculateDifferentiationScore,
    checkForTiedCosmologies
  }
}