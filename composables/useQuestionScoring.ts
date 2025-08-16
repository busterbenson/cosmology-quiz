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
  
  const scoreQuestion = (
    questionKey: string,
    question: Question,
    activeCosmologies: Cosmology[],
    convictionProfile: ConvictionProfile,
    askedConcepts: Set<string>,
    dontKnowCount: number
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

    // Combine all factors
    const baseScore = productScore * bonuses.totalBonus * predictablePenalty
    const entropyContribution = entropyModifier * CONFIG.ENTROPY_WEIGHT * baseScore
    const totalScore = (baseScore + entropyContribution) * uncertaintyBonus

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
      potentialEliminations: yesEliminated + noEliminated
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
    askedConcepts: Set<string>
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
    const questionConcepts = new Set(question.concepts.map(c => c.tag))
    if (!isSubset(questionConcepts, askedConcepts)) {
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
  ): { eliminated: Array<{name: string, category: string}>, newScores: number[] } => {
    const eliminated: Array<{name: string, category: string}> = []
    const newScores = [...scores]

    // Define core skeptical/agnostic cosmologies that embrace uncertainty
    // These cosmologies both require uncertainty comfort AND represent skeptical/agnostic worldviews
    const coreSkepticalCosmologies = new Set([
      'Mystical Agnosticism', 'Epistemological Agnosticism', 'Open Skeptic', 
      'Perpetual Inquiry', 'Transitional Seeking', 'Philosophical Spirituality', 
      'Pragmatic Spirituality'
    ])

    if (answer === '?') {
      cosmologies.forEach((cosmology, i) => {
        if (newScores[i] <= CONFIG.SCORE_ELIMINATE) return

        const cosmologyName = cosmology.Cosmology
        const relation = cosmology[questionKey]
        
        // Boost core skeptical/agnostic cosmologies for "don't know" answers
        if (coreSkepticalCosmologies.has(cosmologyName)) {
          newScores[i] += 7 // Strong boost for philosophies that embrace epistemic humility
        }
        // Also boost all other cosmologies that are "comfortable with uncertainty"
        else if (cosmology['Comfortable with uncertainty'] === 'R') {
          newScores[i] += 3 // Smaller boost for uncertainty-friendly worldviews
        }
        // Apply small penalty to cosmologies that require definite beliefs on this topic
        else if (relation === 'R') {
          newScores[i] += CONFIG.UNCERTAINTY_PENALTY // -2 points for requiring certainty
        }
      })
      return { eliminated, newScores }
    }

    cosmologies.forEach((cosmology, i) => {
      if (newScores[i] <= CONFIG.SCORE_ELIMINATE) return

      const relation = cosmology[questionKey]
      const cosmologyName = cosmology.Cosmology
      const category = cosmology.Category

      if (answer === 'Y') {
        if (relation === 'R') {
          newScores[i] += 10
        } else if (relation === 'NR') {
          newScores[i] += 3
        } else if (relation === 'DB') {
          newScores[i] = CONFIG.SCORE_ELIMINATE
          eliminated.push({ name: cosmologyName, category })
        }
      } else if (answer === 'N') {
        if (relation === 'R') {
          newScores[i] = CONFIG.SCORE_ELIMINATE
          eliminated.push({ name: cosmologyName, category })
        } else if (relation === 'NR') {
          newScores[i] += 3
        } else if (relation === 'DB') {
          newScores[i] += 10
        }
      }
    })

    return { eliminated, newScores }
  }

  // Helper function to check if set A is subset of set B
  const isSubset = <T>(setA: Set<T>, setB: Set<T>): boolean => {
    for (const item of setA) {
      if (!setB.has(item)) {
        return false
      }
    }
    return true
  }

  return {
    scoreQuestion,
    estimateAnswerProbabilities,
    calculateQuestionBonuses,
    processAnswer
  }
}