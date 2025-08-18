import type { 
  Cosmology,
  QuestionLibrary,
  ConvictionProfile,
  QuizState,
  QuizStateSnapshot,
  QuizResult,
  QuizAnswer,
  QuestionScore
} from '~/types'
import { CONFIG } from '~/types'

export const useQuizEngine = () => {
  const dataLoader = useDataLoader()
  const questionScoring = useQuestionScoring()
  
  // Helper to create serializable objects
  const createSerializableObject = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
  }

  // Use global state to maintain quiz state across components
  const quizState = useState<QuizState>('quiz-state', () => ({
    scores: [],
    askedQuestions: ['Order', 'Category', 'Cosmology'], // Skip these columns
    sessionAnswers: [],
    convictionProfile: createSerializableObject({}),
    askedConcepts: [],
    dontKnowCount: 0,
    questionNumber: 0,
    questionHistory: [],
    rankingHistory: [],
    rankingStabilityCount: 0,
    lastEliminationCount: 0,
    noProgressCount: 0,
    tieBreakerMode: false,
    tieBreakerQuestionsAsked: 0,
    coverageQuestionsAsked: 0,
    coveredCategoryGroups: []
  }))

  const isInitialized = useState('quiz-initialized', () => false)
  const currentQuestion = useState<{key: string, question: any, impact: QuestionScore} | null>('current-question', () => null)
  const targetCosmologyForLogging = useState<string | null>('target-cosmology-logging', () => null)

  const initialize = async (): Promise<boolean> => {
    // console.log('🚀 Quiz engine initializing...')
    const success = await dataLoader.loadAllData()
    // console.log('📊 Data loading success:', success)
    
    if (success) {
      // Initialize scores - all start at 0
      quizState.value.scores = new Array(dataLoader.cosmologies.value.length).fill(0)
      // console.log('🎯 Initialized scores for', dataLoader.cosmologies.value.length, 'cosmologies')
      
      isInitialized.value = true
      // console.log('✅ Quiz engine marked as initialized')
      
      // Find first question
      const foundQuestion = await findNextQuestion()
      // console.log('🔍 Found first question:', foundQuestion)
    }
    
    // console.log('🏁 Quiz initialization complete, success:', success)
    return success
  }

  const findNextQuestion = async (): Promise<boolean> => {
    const activeCosmologies = getActiveCosmologies()
    const potentialQuestions = getPotentialQuestions()
    const topCosmologies = getTopActiveCosmologies()

    // Debug logging
    // console.log('Finding next question:', {
    //   activeCosmologies: activeCosmologies.length,
    //   potentialQuestions: potentialQuestions.length,
    //   questionsLoaded: Object.keys(dataLoader.questions.value).length,
    //   cosmologiesLoaded: dataLoader.cosmologies.value.length
    // })

    if (potentialQuestions.length === 0 || activeCosmologies.length <= 1) {
      currentQuestion.value = null
      return false
    }

    // Enhanced viability filter: consider both elimination and differentiation
    const filteredOutQuestions: string[] = []
    const viableQuestions = potentialQuestions.filter(questionKey => {
      const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length
      const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length
      
      // Check if question involves concepts user has strongly rejected
      // BUT allow questions that would significantly boost top cosmologies
      const question = dataLoader.questions.value[questionKey]
      if (question) {
        let hasRejectedConcept = false
        let rejectedConceptInfo = ''
        
        for (const concept of question.concepts) {
          const tag = concept.tag
          if (tag in quizState.value.convictionProfile) {
            const conCount = quizState.value.convictionProfile[tag].con
            if (conCount >= CONFIG.CONCEPT_ELIMINATION_THRESHOLD) {
              hasRejectedConcept = true
              rejectedConceptInfo = `${tag}, conCount: ${conCount}`
              break
            }
          }
        }
        
        // If question involves rejected concepts, check if it would boost top cosmologies
        if (hasRejectedConcept && topCosmologies.length > 0) {
          const { differentiationScore, boostedCount } = questionScoring.calculateDifferentiationScore(
            questionKey, 
            topCosmologies
          )
          
          // Allow questions that would boost top cosmologies (especially if they boost highly-ranked ones)
          const wouldBoostTopCosmologies = boostedCount >= 1 && differentiationScore > 5
          
          if (!wouldBoostTopCosmologies) {
            filteredOutQuestions.push(`${questionKey} (rejected concept: ${rejectedConceptInfo})`)
            return false // Skip this question
          } else {
            // console.log(`🔓 Allowing rejected concept question "${questionKey}" because it would boost ${boostedCount} top cosmologies (diff: ${differentiationScore.toFixed(1)})`)
          }
        } else if (hasRejectedConcept) {
          filteredOutQuestions.push(`${questionKey} (rejected concept: ${rejectedConceptInfo})`)
          return false // Skip this question
        }
      }

      // Can eliminate cosmologies (original logic)
      const canEliminate = yesEliminated > 0 || noEliminated > 0
      
      // Can differentiate top cosmologies
      let canDifferentiate = false
      if (topCosmologies.length > 0) {
        const { differentiationEfficiency } = questionScoring.calculateDifferentiationScore(
          questionKey, 
          topCosmologies
        )
        canDifferentiate = differentiationEfficiency >= CONFIG.MIN_DIFFERENTIATION_EFFICIENCY
      }
      
      const isViable = canEliminate || canDifferentiate
      if (!isViable && (yesEliminated > 0 || noEliminated > 0 || canDifferentiate)) {
        filteredOutQuestions.push(`${questionKey} (canElim: ${canEliminate}, canDiff: ${canDifferentiate}, eff: ${canDifferentiate ? questionScoring.calculateDifferentiationScore(questionKey, topCosmologies).differentiationEfficiency.toFixed(2) : 'N/A'})`)
      }
      
      // Question is viable if it can eliminate OR differentiate
      return isViable
    })
    
    // Debug: Check if target cosmology's Required questions are being filtered out
    if (targetCosmologyForLogging.value === 'Continuous Creation') {
      const ccRequiredQuestions = ['Divine intervention in evolution', 'One supreme being', 'Gods interact with humanity', 'Major religions accurate in essence']
      const missingCCQuestions = ccRequiredQuestions.filter(q => !viableQuestions.includes(q) && potentialQuestions.includes(q))
      if (missingCCQuestions.length > 0) {
        console.log(`❌ Continuous Creation Required questions filtered out: ${missingCCQuestions.join(', ')}`)
        missingCCQuestions.forEach(q => {
          const question = dataLoader.questions.value[q]
          if (question) {
            console.log(`   - ${q}: concepts = ${question.concepts.map(c => `${c.tag}(${c.polarity})`).join(', ')}`)
          }
        })
      }
    }

    // console.log('Viable questions debug:')
    // console.log('- Potential questions:', potentialQuestions.length)
    // console.log('- Viable questions:', viableQuestions.length)
    // console.log('- Sample viable:', viableQuestions.slice(0, 3))
    
    // Check a few questions manually
    // if (potentialQuestions.length > 0) {
    //   const testQ = potentialQuestions[0]
    //   console.log(`- Testing question "${testQ}":`)
    //   console.log('  - Sample cosmology values:')
    //   activeCosmologies.slice(0, 5).forEach(c => {
    //     console.log(`    ${c.Cosmology}: "${c[testQ]}"`)
    //   })
    // }

    if (viableQuestions.length === 0) {
      currentQuestion.value = null
      return false
    }

    // Coverage Phase: Check if we should prioritize coverage questions
    const coveragePhase = useCoveragePhase()
    
    // For coverage info, consider all active cosmologies
    const allActiveCosmologies = activeCosmologies.map((cosmology, index) => ({
      ...cosmology,
      score: quizState.value.scores[dataLoader.cosmologies.value.findIndex(c => c === cosmology)],
      rank: index + 1
    })).sort((a, b) => b.score - a.score).map((c, index) => ({ ...c, rank: index + 1 }))
    
    const coverageInfo = coveragePhase.getCoverageInfo(allActiveCosmologies, quizState.value.askedQuestions)
    const uncoveredCount = coverageInfo.totalUncoveredGroups
    
    const shouldEnterCoveragePhase = (
      CONFIG.COVERAGE_PHASE_ENABLED &&
      activeCosmologies.length <= CONFIG.COVERAGE_PHASE_TRIGGER_THRESHOLD &&
      uncoveredCount > 0 &&  // Prioritize if there are still uncovered categories
      quizState.value.coverageQuestionsAsked < CONFIG.COVERAGE_PHASE_MAX_QUESTIONS
    )

    // Enhanced Coverage Phase logging
    if (CONFIG.COVERAGE_PHASE_ENABLED) {
      const triggerConditions = {
        cosmologiesRemaining: activeCosmologies.length,
        triggerThreshold: CONFIG.COVERAGE_PHASE_TRIGGER_THRESHOLD,
        belowThreshold: activeCosmologies.length <= CONFIG.COVERAGE_PHASE_TRIGGER_THRESHOLD,
        inTieBreaker: quizState.value.tieBreakerMode,
        uncoveredCount: uncoveredCount,
        hasUncovered: uncoveredCount > 0,
        questionsAsked: quizState.value.coverageQuestionsAsked,
        maxQuestions: CONFIG.COVERAGE_PHASE_MAX_QUESTIONS,
        underLimit: quizState.value.coverageQuestionsAsked < CONFIG.COVERAGE_PHASE_MAX_QUESTIONS
      }
      
      console.log(`📋 Coverage Phase Status:`, {
        enabled: CONFIG.COVERAGE_PHASE_ENABLED,
        shouldEnter: shouldEnterCoveragePhase,
        viableGroups: coverageInfo.totalViableGroups,
        uncoveredGroups: coverageInfo.totalUncoveredGroups,
        allCovered: coverageInfo.allGroupsCovered,
        coveredCategories: quizState.value.coveredCategoryGroups,
        triggerConditions
      })
    }

    if (shouldEnterCoveragePhase) {      
      const coverageQuestion = coveragePhase.findNextCoverageQuestion(allActiveCosmologies, quizState.value.askedQuestions)
      const currentCoverageInfo = coveragePhase.getCoverageInfo(allActiveCosmologies, quizState.value.askedQuestions)
      
      console.log(`📋 Coverage Phase Details:`, {
        nextQuestion: coverageQuestion,
        isViable: coverageQuestion ? viableQuestions.includes(coverageQuestion) : false,
        viableGroups: currentCoverageInfo.viableGroups.map(g => ({
          group: g.group,
          highestRank: g.highestRank,
          cosmologies: g.cosmologies
        })),
        uncoveredGroups: currentCoverageInfo.uncoveredGroups.map(g => ({
          group: g.group,
          highestRank: g.highestRank,
          representativeQuestion: coveragePhase.REPRESENTATIVE_QUESTIONS[g.group as keyof typeof coveragePhase.REPRESENTATIVE_QUESTIONS]
        }))
      })
      
      if (coverageQuestion && viableQuestions.includes(coverageQuestion)) {
        const question = dataLoader.questions.value[coverageQuestion]
        if (question) {
          const impact = questionScoring.scoreQuestion(
            coverageQuestion,
            question,
            activeCosmologies,
            quizState.value.convictionProfile,
            quizState.value.askedConcepts,
            quizState.value.dontKnowCount,
            topCosmologies,
            quizState.value.tieBreakerMode
          )
          
          // Find which category this question represents
          const categoryGroup = Object.entries(coveragePhase.REPRESENTATIVE_QUESTIONS).find(
            ([group, repQ]) => repQ === coverageQuestion
          )?.[0]
          
          console.log(`📋 Coverage Phase: Selected "${coverageQuestion}" for category "${categoryGroup}"`)
          console.log(`   Score breakdown: boost +${impact.coverageBoost}, total ${impact.totalScore.toFixed(1)}`)
          console.log(`   This ensures representation for category group with cosmologies:`, 
            currentCoverageInfo.viableGroups.find(g => g.group === categoryGroup)?.cosmologies || []
          )
          
          currentQuestion.value = {
            key: coverageQuestion,
            question: question,
            impact: impact
          }
          return true
        }
      } else {
        if (!coverageQuestion) {
          console.log(`📋 Coverage Phase: No uncovered viable questions found (${currentCoverageInfo.totalUncoveredGroups} uncovered groups, but no representative questions available)`)
        } else {
          console.log(`📋 Coverage Phase: Question "${coverageQuestion}" not viable (filtered out by concept rejection or other filters)`)
        }
      }
    }

    // Score all viable questions
    let bestQuestion: string | null = null
    let bestScore = -1
    let bestImpact: QuestionScore | null = null

    // const modeInfo = quizState.value.tieBreakerMode ? ` [TIE-BREAKER MODE - top ${topCosmologies.length}]` : ''
    // console.log(`📊 Scoring ${viableQuestions.length} viable questions (${activeCosmologies.length} active, top: ${topCosmologies.slice(0,3).map(c => c.Cosmology).join(', ')})${modeInfo}`)
    let scoredCount = 0

    for (const questionKey of viableQuestions) {
      const question = dataLoader.questions.value[questionKey]
      if (!question) {
        // console.log(`  - Question "${questionKey}" not found in library`)
        continue
      }

      const impact = questionScoring.scoreQuestion(
        questionKey,
        question,
        activeCosmologies,
        quizState.value.convictionProfile,
        quizState.value.askedConcepts,
        quizState.value.dontKnowCount,
        topCosmologies,
        quizState.value.tieBreakerMode
      )

      scoredCount++
      // if (scoredCount <= 3) {
      //   console.log(`  - "${questionKey}": score ${impact.totalScore} (yes: ${impact.yesEliminated}, no: ${impact.noEliminated})`)
      // }

      if (impact.totalScore > bestScore) {
        bestScore = impact.totalScore
        bestQuestion = questionKey
        bestImpact = impact
      }
    }

    // Debug: Log top scoring questions for target cosmology testing
    if (targetCosmologyForLogging.value === 'Continuous Creation') {
      const questionScores = []
      for (const questionKey of viableQuestions.slice(0, 10)) {
        const question = dataLoader.questions.value[questionKey]
        if (question) {
          const impact = questionScoring.scoreQuestion(
            questionKey, question, activeCosmologies, quizState.value.convictionProfile,
            quizState.value.askedConcepts, quizState.value.dontKnowCount, topCosmologies, quizState.value.tieBreakerMode
          )
          questionScores.push({ question: questionKey, score: impact.totalScore, eliminations: impact.potentialEliminations })
        }
      }
      questionScores.sort((a, b) => b.score - a.score)
      // Enhanced debug output with Required Question Boost info
      const detailedScores = []
      for (const questionKey of viableQuestions.slice(0, 5)) {
        const question = dataLoader.questions.value[questionKey]
        if (question) {
          const impact = questionScoring.scoreQuestion(
            questionKey, question, activeCosmologies, quizState.value.convictionProfile,
            quizState.value.askedConcepts, quizState.value.dontKnowCount, topCosmologies, quizState.value.tieBreakerMode
          )
          detailedScores.push({
            question: questionKey,
            score: impact.totalScore,
            eliminations: impact.potentialEliminations,
            requiredBoost: impact.requiredQuestionBoost || 0,
            requiredMatches: impact.requiredCosmologyMatches || 0
          })
        }
      }
      detailedScores.sort((a, b) => b.score - a.score)
      
      console.log(`🔍 Top scoring questions with Required Question Boost (helps lower-ranked cosmologies):`)
      detailedScores.forEach((q, i) => {
        const boostInfo = q.requiredMatches > 0 ? ` | RQB: +${q.requiredBoost.toFixed(1)} (${q.requiredMatches} lower-ranked cosmologies)` : ''
        console.log(`  ${i+1}. ${q.question}: ${q.score.toFixed(1)} (elim: ${q.eliminations}${boostInfo})`)
      })
      
      // Debug: Check if Classical Gnosticism Required questions are being scored
      if (targetCosmologyForLogging.value === 'Classical Gnosticism') {
        const gnosticQuestions = [
          'Mainstream history incomplete/manipulated',
          'Material world created by flawed being',
          'Salvation through secret knowledge', 
          'Reality divided between spirit and matter',
          'Practical results over theory',
          'Reality as simulation/program'
        ]
        
        console.log(`🔮 Classical Gnosticism Required questions analysis:`)
        for (const questionKey of gnosticQuestions) {
          const question = dataLoader.questions.value[questionKey]
          if (question) {
            const impact = questionScoring.scoreQuestion(
              questionKey, question, activeCosmologies, quizState.value.convictionProfile,
              quizState.value.askedConcepts, quizState.value.dontKnowCount, topCosmologies, quizState.value.tieBreakerMode
            )
            const boostInfo = impact.requiredCosmologyMatches > 0 ? ` | RQB: +${impact.requiredQuestionBoost.toFixed(1)}` : ''
            console.log(`  ${questionKey}: ${impact.totalScore.toFixed(1)} (elim: ${impact.potentialEliminations}${boostInfo})`)
          }
        }
      }
    }
    
    // console.log(`Scored ${scoredCount} questions, best: "${bestQuestion}" with score ${bestScore}`)

    if (bestQuestion && bestImpact) {
      currentQuestion.value = {
        key: bestQuestion,
        question: dataLoader.questions.value[bestQuestion],
        impact: bestImpact
      }
      // console.log(`✅ Selected: "${bestQuestion}" (score: ${bestScore.toFixed(1)}, diff: ${bestImpact.differentiationScore?.toFixed(1) || 0}, eff: ${bestImpact.differentiationEfficiency?.toFixed(2) || 0}, boost: ${bestImpact.boostedCount || 0}/${topCosmologies.length})`)
      return true
    }

    currentQuestion.value = null
    return false
  }

  const answerQuestion = async (answer: QuizAnswer): Promise<{ eliminatedCosmologies: string[] } | void> => {
    if (!currentQuestion.value) return

    const questionKey = currentQuestion.value.key
    const question = currentQuestion.value.question

    // Handle back functionality
    if (answer === 'B') {
      await handleBack()
      return
    }

    const scoresBefore = [...quizState.value.scores]

    // Save state before processing answer
    saveStateSnapshot(questionKey, answer)

    // Update question number and track answer
    quizState.value.questionNumber++
    if (quizState.value.tieBreakerMode) {
      quizState.value.tieBreakerQuestionsAsked++
    }
    
    // Track coverage questions
    const coveragePhase = useCoveragePhase()
    if (coveragePhase.isCoverageQuestion(questionKey)) {
      quizState.value.coverageQuestionsAsked++
      const categoryGroup = Object.entries(coveragePhase.REPRESENTATIVE_QUESTIONS).find(
        ([group, repQ]) => repQ === questionKey
      )?.[0]
      if (categoryGroup && !quizState.value.coveredCategoryGroups.includes(categoryGroup)) {
        quizState.value.coveredCategoryGroups.push(categoryGroup)
      }
    }
    
    quizState.value.sessionAnswers.push({
      questionId: question.id,
      answer
    })

    // Handle "don't know" count
    if (answer === '?') {
      quizState.value.dontKnowCount++
    } else {
      quizState.value.dontKnowCount = 0 // Reset on definitive answer
    }

    // Process the answer and update scores
    const { newScores, boosted } = questionScoring.processAnswer(
      questionKey,
      answer,
      dataLoader.cosmologies.value,
      quizState.value.scores
    )

    quizState.value.scores = newScores

    // Update conviction profile
    updateConvictionProfile(question, answer)

    // Process mutual exclusions if user answered Yes (but NOT for Don't Know answers)
    if (answer === 'Y' && question.excludes) {
      processExclusions(question.excludes, boosted)
    }

    // Apply concept boosts and eliminations
    applyConceptBoosts()
    eliminateRejectedConceptCosmologies(boosted)

    // Mark question as asked
    quizState.value.askedQuestions.push(questionKey)

    // Determine which cosmologies were just eliminated
    const eliminatedCosmologies = dataLoader.cosmologies.value
      .filter((cosmology, index) => {
        const scoreBefore = scoresBefore[index]
        const scoreAfter = quizState.value.scores[index]
        return scoreBefore > CONFIG.SCORE_ELIMINATE && scoreAfter <= CONFIG.SCORE_ELIMINATE
      })
      .map(c => c.Cosmology)

    // Update progress tracking
    updateProgressTracking(eliminatedCosmologies.length)

    // Find next question
    await findNextQuestion()

    return {
      eliminatedCosmologies
    }
  }

  const updateConvictionProfile = (question: any, answer: QuizAnswer): void => {
    if (answer === '?') return

    for (const concept of question.concepts) {
      const tag = concept.tag
      const polarity = concept.polarity

      // Initialize if not exists
      if (!(tag in quizState.value.convictionProfile)) {
        quizState.value.convictionProfile[tag] = createSerializableObject({ pro: 0, con: 0 })
      }

      if (!quizState.value.askedConcepts.includes(tag)) {
        quizState.value.askedConcepts.push(tag)
      }

      if (answer === 'Y') {
        quizState.value.convictionProfile[tag][polarity]++
      } else if (answer === 'N') {
        const opposite = polarity === 'pro' ? 'con' : 'pro'
        quizState.value.convictionProfile[tag][opposite]++
      }
    }
  }

  const processExclusions = (excludes: any, boosted?: Array<{name: string, points: number, reason: string}>): void => {
    const boostedNames = new Set((boosted || []).map(b => b.name))
    
    // Remove excluded questions from consideration
    const excludedQuestions = excludes.questions || []
    for (const excludedQ of excludedQuestions) {
      if (!quizState.value.askedQuestions.includes(excludedQ)) {
        quizState.value.askedQuestions.push(excludedQ)
      }
    }

    // Apply penalties to excluded concepts
    const excludedConcepts = excludes.concepts || []
    for (const conceptTag of excludedConcepts) {
      if (!(conceptTag in quizState.value.convictionProfile)) {
        quizState.value.convictionProfile[conceptTag] = createSerializableObject({ pro: 0, con: 0 })
      }
      quizState.value.convictionProfile[conceptTag].con += 2
      // console.log(`📉 Excluded concept "${conceptTag}" now has ${quizState.value.convictionProfile[conceptTag].con} con convictions`)
    }

    // Eliminate excluded cosmologies directly
    const excludedCosmologies = excludes.cosmologies || []
    for (const cosmologyName of excludedCosmologies) {
      const index = dataLoader.cosmologies.value.findIndex(c => c.Cosmology === cosmologyName)
      if (index !== -1 && quizState.value.scores[index] > CONFIG.SCORE_ELIMINATE) {
        quizState.value.scores[index] = CONFIG.SCORE_ELIMINATE
      }
    }

    // Eliminate cosmologies that require excluded concepts (but protect recently boosted ones)
    for (const conceptTag of excludedConcepts) {
      const conceptEliminations = eliminateCosmologiesRequiringConcept(conceptTag, boostedNames)
      // Store concept eliminations for better reporting (could be used later)
    }
  }

  const eliminateCosmologiesRequiringConcept = (conceptTag: string, boostedNames?: Set<string>): Array<{cosmology: string, question: string, concept: string}> => {
    const eliminations: Array<{cosmology: string, question: string, concept: string}> = []
    
    for (const [questionKey, question] of Object.entries(dataLoader.questions.value)) {
      if (!(questionKey in dataLoader.cosmologies.value[0])) continue

      for (const concept of question.concepts) {
        if (concept.tag === conceptTag && concept.polarity === 'pro') {
          // Eliminate cosmologies that REQUIRE this concept (but protect recently boosted ones)
          dataLoader.cosmologies.value.forEach((cosmology, i) => {
            if (quizState.value.scores[i] <= CONFIG.SCORE_ELIMINATE) return

            // Protect cosmologies that were just boosted in this answer cycle
            if (boostedNames && boostedNames.has(cosmology.Cosmology)) {
              return
            }

            // Protect materialist cosmologies from "traditional god" concept elimination
            // These cosmologies interpret god-related questions in non-theistic ways
            if (conceptTag === 'traditional god') {
              const materialistCosmologies = [
                'Emergent Materialism', 'Reductive Materialism', 'Scientific Materialism',
                'Physicalism', 'Naturalistic Evolution', 'Quantum Many-Worlds',
                'Computational Universe', 'Information-Theoretic Cosmology'
              ]
              if (materialistCosmologies.includes(cosmology.Cosmology)) {
                console.log(`🛡️ Protected ${cosmology.Cosmology} from "traditional god" concept elimination (materialist interpretation)`)
                return
              }
            }

            const relation = cosmology[questionKey]
            if (relation === 'R') {
              // Only log if it's the target cosmology being tested
              if (targetCosmologyForLogging.value && cosmology.Cosmology === targetCosmologyForLogging.value) {
                console.log(`🚨 ${targetCosmologyForLogging.value.toUpperCase()} eliminated for requiring rejected concept "${conceptTag}" (via question: "${questionKey}")`)
              }
              quizState.value.scores[i] = CONFIG.SCORE_ELIMINATE
              eliminations.push({
                cosmology: cosmology.Cosmology,
                question: questionKey,
                concept: conceptTag
              })
            }
          })
        }
      }
    }
    
    return eliminations
  }

  const applyConceptBoosts = (): void => {
    for (const [conceptTag, counts] of Object.entries(quizState.value.convictionProfile)) {
      const proCount = counts.pro

      if (proCount >= CONFIG.CONCEPT_ELIMINATION_THRESHOLD) {
        // Find cosmologies that align with this concept
        for (const [questionKey, question] of Object.entries(dataLoader.questions.value)) {
          if (!(questionKey in dataLoader.cosmologies.value[0])) continue

          for (const concept of question.concepts) {
            if (concept.tag === conceptTag && concept.polarity === 'pro') {
              // Boost cosmologies that require or benefit from this belief
              dataLoader.cosmologies.value.forEach((cosmology, i) => {
                if (quizState.value.scores[i] <= CONFIG.SCORE_ELIMINATE) return

                const relation = cosmology[questionKey]
                if (relation === 'R') {
                  quizState.value.scores[i] += Math.floor(5 * CONFIG.CONCEPT_BOOST_FACTOR)
                } else if (relation === 'NR') {
                  quizState.value.scores[i] += Math.floor(2 * CONFIG.CONCEPT_BOOST_FACTOR)
                }
              })
            }
          }
        }
      }
    }
  }

  const eliminateRejectedConceptCosmologies = (boosted?: Array<{name: string, points: number, reason: string}>): Array<{cosmology: string, question: string, concept: string}> => {
    const boostedNames = new Set((boosted || []).map(b => b.name))
    const allEliminations: Array<{cosmology: string, question: string, concept: string}> = []
    
    // console.log(`🔍 Checking concept eliminations with conviction profile:`, Object.entries(quizState.value.convictionProfile).map(([concept, counts]) => `${concept}: pro=${counts.pro}, con=${counts.con}`).join(', '))
    
    for (const [conceptTag, counts] of Object.entries(quizState.value.convictionProfile)) {
      const netConvictions = counts.con - counts.pro

      if (netConvictions >= CONFIG.CONCEPT_ELIMINATION_THRESHOLD) {
        // Only log concept elimination if Biblical Literalism might be affected
        console.log(`🔥 Concept "${conceptTag}" reached elimination threshold (${counts.con} con - ${counts.pro} pro = ${netConvictions} net)`)
        const conceptEliminations = eliminateCosmologiesRequiringConcept(conceptTag, boostedNames)
        allEliminations.push(...conceptEliminations)
      }
    }
    
    return allEliminations
  }

  const saveStateSnapshot = (question: string, answer: QuizAnswer): void => {
    const snapshot: QuizStateSnapshot = {
      question,
      answer,
      scores: [...quizState.value.scores],
      convictionProfile: createSerializableObject(quizState.value.convictionProfile),
      askedQuestions: [...quizState.value.askedQuestions],
      askedConcepts: [...quizState.value.askedConcepts],
      dontKnowCount: quizState.value.dontKnowCount,
      questionNumber: quizState.value.questionNumber,
      rankingHistory: JSON.parse(JSON.stringify(quizState.value.rankingHistory)),
      rankingStabilityCount: quizState.value.rankingStabilityCount,
      lastEliminationCount: quizState.value.lastEliminationCount,
      noProgressCount: quizState.value.noProgressCount,
      tieBreakerMode: quizState.value.tieBreakerMode,
      tieBreakerQuestionsAsked: quizState.value.tieBreakerQuestionsAsked,
      coverageQuestionsAsked: quizState.value.coverageQuestionsAsked,
      coveredCategoryGroups: [...quizState.value.coveredCategoryGroups]
    }
    quizState.value.questionHistory.push(snapshot)
  }

  const handleBack = async (): Promise<boolean> => {
    if (quizState.value.questionHistory.length === 0) {
      return false
    }

    const lastSnapshot = quizState.value.questionHistory.pop()!
    
    // Restore state
    quizState.value.scores = lastSnapshot.scores
    quizState.value.convictionProfile = lastSnapshot.convictionProfile
    quizState.value.askedQuestions = lastSnapshot.askedQuestions
    quizState.value.askedConcepts = lastSnapshot.askedConcepts
    quizState.value.dontKnowCount = lastSnapshot.dontKnowCount
    quizState.value.questionNumber = lastSnapshot.questionNumber
    quizState.value.rankingHistory = lastSnapshot.rankingHistory
    quizState.value.rankingStabilityCount = lastSnapshot.rankingStabilityCount
    quizState.value.lastEliminationCount = lastSnapshot.lastEliminationCount
    quizState.value.noProgressCount = lastSnapshot.noProgressCount
    quizState.value.tieBreakerMode = lastSnapshot.tieBreakerMode
    quizState.value.tieBreakerQuestionsAsked = lastSnapshot.tieBreakerQuestionsAsked
    quizState.value.coverageQuestionsAsked = lastSnapshot.coverageQuestionsAsked
    quizState.value.coveredCategoryGroups = lastSnapshot.coveredCategoryGroups

    // Remove the last answer from session
    quizState.value.sessionAnswers.pop()

    // Find the next question after going back
    await findNextQuestion()

    return true
  }

  const getActiveCosmologies = (): Cosmology[] => {
    return dataLoader.cosmologies.value.filter((_, i) => 
      quizState.value.scores[i] > CONFIG.SCORE_ELIMINATE
    )
  }
  
  const getTopActiveCosmologies = (count?: number): Array<Cosmology & { score: number, rank: number }> => {
    // Use different counts based on tie-breaker mode
    const defaultCount = quizState.value.tieBreakerMode 
      ? CONFIG.TIE_BREAKER_TOP_COSMOLOGIES 
      : CONFIG.TOP_COSMOLOGIES_TO_CONSIDER
    const actualCount = count ?? defaultCount
    const activeWithScores = dataLoader.cosmologies.value
      .map((cosmology, i) => ({
        ...cosmology,
        score: quizState.value.scores[i],
        originalIndex: i
      }))
      .filter(c => c.score > CONFIG.SCORE_ELIMINATE)
      .sort((a, b) => b.score - a.score)
      .slice(0, actualCount)
      .map((c, index) => ({
        ...c,
        rank: index + 1
      }))
    
    return activeWithScores
  }

  const getPotentialQuestions = (): string[] => {
    const questionColumns = dataLoader.getQuestionColumns()
    const filtered = questionColumns.filter(q => 
      !quizState.value.askedQuestions.includes(q) && 
      q in dataLoader.questions.value
    )
    
    // console.log('Question filtering debug:', {
    //   allColumns: questionColumns.length,
    //   askedQuestions: quizState.value.askedQuestions,
    //   questionsInLibrary: Object.keys(dataLoader.questions.value).length,
    //   filteredCount: filtered.length,
    //   sampleFiltered: filtered.slice(0, 5)
    // })
    
    return filtered
  }

  const getTopRankings = (): string[] => {
    const activeCosmologies = getActiveCosmologies()
    const results = activeCosmologies.map((cosmology, index) => {
      const originalIndex = dataLoader.cosmologies.value.findIndex(c => c === cosmology)
      return {
        cosmology: cosmology.Cosmology,
        score: quizState.value.scores[originalIndex]
      }
    })
    
    results.sort((a, b) => b.score - a.score)
    return results.slice(0, CONFIG.RANKING_STABILITY_COUNT).map(r => r.cosmology)
  }

  const updateProgressTracking = (eliminatedThisRound: number): void => {
    const currentTop = getTopRankings()
    quizState.value.rankingHistory.push(currentTop)
    quizState.value.lastEliminationCount = eliminatedThisRound
    
    // console.log(`📊 Current top ${CONFIG.RANKING_STABILITY_COUNT}:`, currentTop.join(', '))
    // console.log(`🔥 Eliminations this round: ${eliminatedThisRound}`)
    
    // Check if we made any progress (eliminations OR ranking changes)
    let madeProgress = false
    
    // Progress if we eliminated cosmologies
    if (eliminatedThisRound > 0) {
      madeProgress = true
      // console.log(`✅ Progress: ${eliminatedThisRound} cosmologies eliminated`)
    }
    
    // Progress if rankings changed
    if (CONFIG.RANKING_STABILITY_ENABLED && quizState.value.rankingHistory.length >= 2) {
      const previousTop = quizState.value.rankingHistory[quizState.value.rankingHistory.length - 2]
      
      const rankingsChanged = currentTop.length !== previousTop.length || 
        !currentTop.every((cosmology, index) => cosmology === previousTop[index])
      
      if (rankingsChanged) {
        madeProgress = true
        // console.log(`✅ Progress: Rankings changed [${previousTop.join(', ')}] → [${currentTop.join(', ')}]`)
      }
    }
    
    // Update no-progress counter
    if (madeProgress) {
      quizState.value.noProgressCount = 0
      // console.log(`🔄 Reset no-progress counter (made progress)`)
    } else {
      quizState.value.noProgressCount++
      // console.log(`😴 No progress: ${quizState.value.noProgressCount} consecutive questions with no eliminations or ranking changes`)
    }
  }

  const shouldStopQuiz = (): boolean => {
    const remaining = getActiveCosmologies().length
    const topCosmologies = getTopActiveCosmologies()
    
    // Check if we should enter tie-breaker mode (but not before question 11)
    if (!quizState.value.tieBreakerMode && 
        CONFIG.TIE_BREAKING_MODE_ENABLED &&
        quizState.value.questionNumber >= 11 &&
        topCosmologies.length >= CONFIG.TIE_BREAKING_MIN_TIED &&
        questionScoring.checkForTiedCosmologies(topCosmologies) &&
        quizState.value.noProgressCount >= CONFIG.RANKING_STABILITY_THRESHOLD - 1) {
      
      console.log('🎯 Entering tie-breaker mode: top cosmologies are tied')
      console.log('   Tied cosmologies:', topCosmologies.slice(0, 5).map(c => `${c.Cosmology} (${c.score})`).join(', '))
      quizState.value.tieBreakerMode = true
      quizState.value.tieBreakerQuestionsAsked = 0
      quizState.value.noProgressCount = 0 // Reset progress counter for tie-breaking
      return false // Continue with tie-breaking
    }
    
    // console.log('shouldStopQuiz check:', {
    //   remaining,
    //   questionNumber: quizState.value.questionNumber,
    //   totalCosmologies: dataLoader.cosmologies.value.length,
    //   scoresLength: quizState.value.scores.length,
    //   sampleScores: quizState.value.scores.slice(0, 5),
    //   rankingStabilityCount: quizState.value.rankingStabilityCount,
    //   tieBreakerMode: quizState.value.tieBreakerMode,
    //   tieBreakerQuestionsAsked: quizState.value.tieBreakerQuestionsAsked
    // })
    
    // Stop if only one left
    if (remaining <= 1) {
      console.log('❌ Stopping quiz: remaining cosmologies ≤ 1')
      return true
    }
    
    // Stop if we've asked too many questions
    if (quizState.value.questionNumber >= 30) {
      console.log('❌ Stopping quiz: too many questions')
      return true
    }
    
    // Check diminishing returns
    if (quizState.value.questionNumber > CONFIG.MINIMUM_QUESTIONS) {
      const impact = currentQuestion.value?.impact
      if (impact && impact.potentialEliminations !== undefined && 
          impact.potentialEliminations <= CONFIG.DIMINISHING_RETURNS_THRESHOLD) {
        console.log('❌ Stopping quiz: diminishing returns')
        return true
      }
    }
    
    // Handle tie-breaker mode stopping conditions
    if (quizState.value.tieBreakerMode) {
      if (quizState.value.tieBreakerQuestionsAsked >= CONFIG.TIE_BREAKING_MAX_QUESTIONS) {
        console.log(`❌ Stopping quiz: reached maximum tie-breaker questions (${CONFIG.TIE_BREAKING_MAX_QUESTIONS})`)
        return true
      }
      
      // Check if tie has been broken (only in tie-breaker mode)
      if (!questionScoring.checkForTiedCosmologies(topCosmologies)) {
        console.log(`✅ Stopping quiz: tie has been broken`)
        return true
      }
      
      // Different progress threshold in tie-breaker mode (more lenient)
      if (quizState.value.noProgressCount >= CONFIG.RANKING_STABILITY_THRESHOLD + 2) {
        console.log(`❌ Stopping quiz: no progress in tie-breaker mode for ${quizState.value.noProgressCount} questions`)
        return true
      }
    } else {
      // Normal early stopping: no progress (eliminations or ranking changes) for several questions
      if (CONFIG.STOP_ON_ZERO_ELIMINATIONS && CONFIG.RANKING_STABILITY_ENABLED && 
          quizState.value.questionNumber > CONFIG.MINIMUM_QUESTIONS) {
        
        // console.log(`🔍 Early stopping check: ${quizState.value.noProgressCount} consecutive questions with no progress (threshold: ${CONFIG.RANKING_STABILITY_THRESHOLD})`)
        
        if (quizState.value.noProgressCount >= CONFIG.RANKING_STABILITY_THRESHOLD) {
          console.log(`❌ Stopping quiz: no progress (eliminations OR ranking changes) for ${quizState.value.noProgressCount} consecutive questions`)
          return true
        }
      }
    }
    
    console.log('✅ Quiz should continue')
    return false
  }

  const getResults = (): QuizResult[] => {
    const activeCosmologies = getActiveCosmologies()
    
    const results: QuizResult[] = activeCosmologies.map((cosmology, index) => {
      const originalIndex = dataLoader.cosmologies.value.findIndex(c => c === cosmology)
      return {
        cosmology: cosmology.Cosmology,
        category: cosmology.Category,
        score: quizState.value.scores[originalIndex]
      }
    })

    return results.sort((a, b) => b.score - a.score)
  }

  const getProgress = () => {
    const remaining = getActiveCosmologies().length
    const total = dataLoader.cosmologies.value.length
    const questionNumber = quizState.value.questionNumber
    
    // Estimate total questions needed
    const estimatedTotal = questionNumber + Math.max(3, Math.log2(remaining))
    
    return {
      questionNumber,
      estimatedTotal,
      remaining,
      total,
      progressPercent: Math.min(95, (questionNumber / estimatedTotal) * 100)
    }
  }

  const resetQuiz = (): void => {
    quizState.value = {
      scores: [],
      askedQuestions: ['Order', 'Category', 'Cosmology'],
      sessionAnswers: [],
      convictionProfile: createSerializableObject({}),
      askedConcepts: [],
      dontKnowCount: 0,
      questionNumber: 0,
      questionHistory: [],
      rankingHistory: [],
      rankingStabilityCount: 0,
      lastEliminationCount: 0,
      noProgressCount: 0,
      tieBreakerMode: false,
      tieBreakerQuestionsAsked: 0,
      coverageQuestionsAsked: 0,
      coveredCategoryGroups: []
    }
    currentQuestion.value = null
  }

  const reconstructQuiz = async (answerPairs: Array<{id: number, answer: QuizAnswer}>): Promise<void> => {
    console.log('🔄 Reconstructing quiz from permalink with', answerPairs.length, 'answers')
    
    // Reset quiz state
    resetQuiz()
    
    // Initialize scores array with starting values (0 for all cosmologies)
    quizState.value.scores = new Array(dataLoader.cosmologies.value.length).fill(0)
    console.log('✅ Initialized scores array with', quizState.value.scores.length, 'entries')
    
    // Build question ID map
    const questionIdMap = new Map<number, string>()
    for (const [key, question] of Object.entries(dataLoader.questions.value)) {
      if ((question as any).id) {
        questionIdMap.set((question as any).id, key)
      }
    }
    console.log('📝 Built question ID map with', questionIdMap.size, 'entries')
    console.log('📋 Sample questions:', Object.keys(dataLoader.questions.value).slice(0, 3))
    
    // Process each answer in sequence by simulating the quiz flow
    for (const pair of answerPairs) {
      const questionKey = questionIdMap.get(pair.id)
      if (questionKey && dataLoader.questions.value[questionKey]) {
        console.log(`🎯 Processing answer: Q${pair.id} (${questionKey}) = ${pair.answer}`)
        
        // Set the current question to simulate the normal quiz flow
        const question = dataLoader.questions.value[questionKey]
        
        // Validate question structure
        if (!question.concepts || !Array.isArray(question.concepts)) {
          console.error(`❌ Question ${questionKey} has invalid concepts:`, question.concepts)
          continue
        }
        
        const activeCosmologies = getActiveCosmologies()
        const questionScore = questionScoring.scoreQuestion(
          questionKey,
          question,
          activeCosmologies,
          quizState.value.convictionProfile,
          quizState.value.askedConcepts,
          quizState.value.dontKnowCount
        )
        currentQuestion.value = {
          key: questionKey,
          question,
          impact: questionScore
        }
        
        // Store the answer in session answers for permalink generation
        quizState.value.sessionAnswers.push({
          questionId: pair.id,
          answer: pair.answer
        })
        
        // Now answer the question
        await answerQuestion(pair.answer)
      } else {
        console.warn(`⚠️ Could not find question for ID ${pair.id}`)
      }
    }
    
    // Clear current question after reconstruction
    currentQuestion.value = null
    
    console.log('🏁 Quiz reconstruction complete. Final scores sample:', quizState.value.scores.slice(0, 5))
    console.log('📊 Active cosmologies:', getActiveCosmologies().length)
  }

  const runAutoQuiz = async (answerProfile: Record<string, QuizAnswer>, targetCosmology?: string): Promise<{
    questionsAsked: string[]
    answersGiven: QuizAnswer[]
    answerString: string
    finalResults: QuizResult[]
    totalQuestions: number
    permalink: string
    eliminationHistory: Array<{
      questionIndex: number
      question: string
      answer: QuizAnswer
      cosmology: string
      relation: string
      reason: string
    }>
  }> => {
    console.log('🤖 Starting auto-quiz with answer profile:', Object.keys(answerProfile).length, 'answers')
    
    // Set target cosmology for logging
    targetCosmologyForLogging.value = targetCosmology || null
    
    // Reset quiz state
    quizState.value.scores = new Array(dataLoader.cosmologies.value.length).fill(0)
    quizState.value.askedQuestions = ['Order', 'Category', 'Cosmology']
    quizState.value.sessionAnswers = []
    quizState.value.convictionProfile = createSerializableObject({})
    quizState.value.askedConcepts = []
    quizState.value.dontKnowCount = 0
    quizState.value.questionNumber = 0
    quizState.value.questionHistory = []
    quizState.value.rankingHistory = []
    quizState.value.rankingStabilityCount = 0
    quizState.value.lastEliminationCount = 0
    quizState.value.noProgressCount = 0
    quizState.value.tieBreakerMode = false
    quizState.value.tieBreakerQuestionsAsked = 0
    quizState.value.coverageQuestionsAsked = 0
    quizState.value.coveredCategoryGroups = []
    
    const questionsAsked: string[] = []
    const answersGiven: QuizAnswer[] = []
    const eliminationHistory: Array<{
      questionIndex: number
      question: string
      answer: QuizAnswer
      cosmology: string
      relation: string
      reason: string
    }> = []
    
    // Initialize if not already done
    if (!isInitialized.value) {
      await initialize()
    }
    
    let iterationCount = 0
    const maxIterations = 50 // Safety limit
    
    while (iterationCount < maxIterations) {
      // Find next question
      const hasNextQuestion = await findNextQuestion()
      if (!hasNextQuestion || !currentQuestion.value) {
        console.log('🛑 Auto-quiz stopped: No more questions available')
        break
      }
      
      // Check stopping conditions AFTER finding question (to get current impact)
      if (shouldStopQuiz()) {
        console.log('🛑 Auto-quiz stopped: shouldStopQuiz() returned true')
        break
      }
      
      const questionKey = currentQuestion.value.key
      questionsAsked.push(questionKey)
      
      // Look up answer from profile
      let answer: QuizAnswer
      if (questionKey in answerProfile) {
        answer = answerProfile[questionKey]
      } else {
        // Fallback to 'N' if question not in profile
        answer = 'N'
        console.log(`⚠️ Question "${questionKey}" not in answer profile, using 'N'`)
      }
      
      answersGiven.push(answer)
      // console.log(`📝 Question ${iterationCount + 1}: "${questionKey}" → ${answer}`)
      
      // Track eliminations before answering
      const scoresBefore = [...quizState.value.scores]
      
      // Debug: Track Analytical Idealism specifically
      const aiIndex = dataLoader.cosmologies.value.findIndex(c => c.Cosmology === 'Analytical Idealism')
      // if (aiIndex !== -1) {
      //   console.log(`🧠 [Q${iterationCount + 1}] Analytical Idealism before: score=${scoresBefore[aiIndex]}, question="${questionKey}", answer="${answer}", relation="${dataLoader.cosmologies.value[aiIndex][questionKey] || 'NONE'}"`)
      // }
      
      // Answer the question
      await answerQuestion(answer)
      
      // Check for eliminations after answering
      const scoresAfter = quizState.value.scores
      
      // Get boost information from the last answer
      const { boosted: currentBoosted } = questionScoring.processAnswer(
        questionKey, answer, dataLoader.cosmologies.value, scoresBefore
      )
      
      // Debug: Track Analytical Idealism after processing
      // if (aiIndex !== -1) {
      //   const scoreDelta = scoresAfter[aiIndex] - scoresBefore[aiIndex]
      //   console.log(`🧠 [Q${iterationCount + 1}] Analytical Idealism after: score=${scoresAfter[aiIndex]} (${scoreDelta >= 0 ? '+' : ''}${scoreDelta})`)
      //   
      //   // Log if it was boosted
      //   const aiBoost = currentBoosted.find(b => b.name === 'Analytical Idealism')
      //   if (aiBoost) {
      //     console.log(`🧠 [Q${iterationCount + 1}] Analytical Idealism boost: +${aiBoost.points} for ${aiBoost.reason}`)
      //   }
      // }
      
      dataLoader.cosmologies.value.forEach((cosmology, i) => {
        const scoreBefore = scoresBefore[i]
        const scoreAfter = scoresAfter[i]
        
        // Check if this cosmology was just eliminated
        if (scoreBefore > CONFIG.SCORE_ELIMINATE && scoreAfter <= CONFIG.SCORE_ELIMINATE) {
          const relation = cosmology[questionKey] || ''
          let reason = 'Unknown elimination'
          
          if (answer === 'Y' && relation === 'DB') {
            reason = 'YES answer to Deal Breaker question'
          } else if (answer === 'N' && relation === 'R') {
            reason = 'NO answer to Required question'
          } else {
            // Check if this cosmology was just boosted but still eliminated
            const wasJustBoosted = currentBoosted.find(b => b.name === cosmology.Cosmology)
            if (wasJustBoosted) {
              reason = `Eliminated by concept logic despite being boosted (+${wasJustBoosted.points} for ${wasJustBoosted.reason})`
            } else {
              // Better specify that this was concept elimination, not related to current question's direct relation
              reason = `Eliminated by concept elimination (requires a concept the user has rejected, not related to current question "${questionKey}" with relation "${relation}")`
            }
          }
          
          eliminationHistory.push({
            questionIndex: iterationCount,
            question: questionKey,
            answer,
            cosmology: cosmology.Cosmology,
            relation,
            reason
          })
          
          // console.log(`🚨 Eliminated: ${cosmology.Cosmology} (${reason})`)
        }
      })
      
      iterationCount++
      
      // Check stopping conditions again AFTER answering (when ranking stability is updated)
      if (shouldStopQuiz()) {
        console.log('🛑 Auto-quiz stopped: shouldStopQuiz() returned true (post-answer check)')
        break
      }
    }
    
    if (iterationCount >= maxIterations) {
      console.log('⚠️ Auto-quiz stopped: Reached maximum iterations')
    }
    
    // Get final results
    const finalResults = getResults()
    
    // Generate answer string and permalink
    const answerString = quizState.value.sessionAnswers.map(sa => {
      const answerChar = sa.answer === 'Y' ? 'Y' : sa.answer === 'N' ? 'N' : 'U'
      return `${sa.questionId}${answerChar}`
    }).join('.')
    
    const permalink = `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/results?answers=${answerString}`
    
    console.log('✅ Auto-quiz completed:', {
      totalQuestions: questionsAsked.length,
      answerString,
      topResult: finalResults[0]?.cosmology
    })
    
    return {
      questionsAsked,
      answersGiven,
      answerString,
      finalResults,
      totalQuestions: questionsAsked.length,
      permalink,
      eliminationHistory
    }
  }

  return {
    // State
    quizState: readonly(quizState),
    currentQuestion: readonly(currentQuestion),
    isInitialized: readonly(isInitialized),
    
    // Data access
    cosmologies: dataLoader.cosmologies,
    questions: dataLoader.questions,
    summaries: dataLoader.summaries,
    fullDescriptions: dataLoader.fullDescriptions,
    
    // Methods
    initialize,
    answerQuestion,
    shouldStopQuiz,
    getResults,
    getProgress,
    getActiveCosmologies,
    findNextQuestion,
    runAutoQuiz,
    reconstructQuiz,
    resetQuiz
  }
}