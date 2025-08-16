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
  
  // Use global state to maintain quiz state across components
  const quizState = useState<QuizState>('quiz-state', () => ({
    scores: [],
    askedQuestions: ['Order', 'Category', 'Cosmology'], // Skip these columns
    sessionAnswers: [],
    convictionProfile: {},
    askedConcepts: new Set<string>(),
    dontKnowCount: 0,
    questionNumber: 0,
    questionHistory: []
  }))

  const isInitialized = useState('quiz-initialized', () => false)
  const currentQuestion = useState<{key: string, question: any, impact: QuestionScore} | null>('current-question', () => null)

  const initialize = async (): Promise<boolean> => {
    console.log('🚀 Quiz engine initializing...')
    const success = await dataLoader.loadAllData()
    console.log('📊 Data loading success:', success)
    
    if (success) {
      // Initialize scores - all start at 0
      quizState.value.scores = new Array(dataLoader.cosmologies.value.length).fill(0)
      console.log('🎯 Initialized scores for', dataLoader.cosmologies.value.length, 'cosmologies')
      
      isInitialized.value = true
      console.log('✅ Quiz engine marked as initialized')
      
      // Find first question
      const foundQuestion = await findNextQuestion()
      console.log('🔍 Found first question:', foundQuestion)
    }
    
    console.log('🏁 Quiz initialization complete, success:', success)
    return success
  }

  const findNextQuestion = async (): Promise<boolean> => {
    const activeCosmologies = getActiveCosmologies()
    const potentialQuestions = getPotentialQuestions()

    // Debug logging
    console.log('Finding next question:', {
      activeCosmologies: activeCosmologies.length,
      potentialQuestions: potentialQuestions.length,
      questionsLoaded: Object.keys(dataLoader.questions.value).length,
      cosmologiesLoaded: dataLoader.cosmologies.value.length
    })

    if (potentialQuestions.length === 0 || activeCosmologies.length <= 1) {
      currentQuestion.value = null
      return false
    }

    // Filter to viable questions (ones that can eliminate cosmologies)
    const viableQuestions = potentialQuestions.filter(questionKey => {
      const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length
      const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length
      
      // Check if question involves concepts user has strongly rejected
      const question = dataLoader.questions.value[questionKey]
      if (question) {
        for (const concept of question.concepts) {
          const tag = concept.tag
          if (tag in quizState.value.convictionProfile) {
            const conCount = quizState.value.convictionProfile[tag].con
            if (conCount >= CONFIG.CONCEPT_ELIMINATION_THRESHOLD) {
              return false // Skip this question
            }
          }
        }
      }

      const isViable = yesEliminated > 0 || noEliminated > 0
      return isViable
    })

    console.log('Viable questions debug:')
    console.log('- Potential questions:', potentialQuestions.length)
    console.log('- Viable questions:', viableQuestions.length)
    console.log('- Sample viable:', viableQuestions.slice(0, 3))
    
    // Check a few questions manually
    if (potentialQuestions.length > 0) {
      const testQ = potentialQuestions[0]
      console.log(`- Testing question "${testQ}":`)
      console.log('  - Sample cosmology values:')
      activeCosmologies.slice(0, 5).forEach(c => {
        console.log(`    ${c.Cosmology}: "${c[testQ]}"`)
      })
    }

    if (viableQuestions.length === 0) {
      currentQuestion.value = null
      return false
    }

    // Score all viable questions
    let bestQuestion: string | null = null
    let bestScore = -1
    let bestImpact: QuestionScore | null = null

    console.log('Scoring viable questions...')
    let scoredCount = 0

    for (const questionKey of viableQuestions) {
      const question = dataLoader.questions.value[questionKey]
      if (!question) {
        console.log(`  - Question "${questionKey}" not found in library`)
        continue
      }

      const impact = questionScoring.scoreQuestion(
        questionKey,
        question,
        activeCosmologies,
        quizState.value.convictionProfile,
        quizState.value.askedConcepts,
        quizState.value.dontKnowCount
      )

      scoredCount++
      if (scoredCount <= 3) {
        console.log(`  - "${questionKey}": score ${impact.totalScore} (yes: ${impact.yesEliminated}, no: ${impact.noEliminated})`)
      }

      if (impact.totalScore > bestScore) {
        bestScore = impact.totalScore
        bestQuestion = questionKey
        bestImpact = impact
      }
    }

    console.log(`Scored ${scoredCount} questions, best: "${bestQuestion}" with score ${bestScore}`)

    if (bestQuestion && bestImpact) {
      currentQuestion.value = {
        key: bestQuestion,
        question: dataLoader.questions.value[bestQuestion],
        impact: bestImpact
      }
      console.log(`✅ Set current question: "${bestQuestion}"`)
      return true
    }

    currentQuestion.value = null
    return false
  }

  const answerQuestion = async (answer: QuizAnswer): Promise<void> => {
    if (!currentQuestion.value) return

    const questionKey = currentQuestion.value.key
    const question = currentQuestion.value.question

    // Handle back functionality
    if (answer === 'B') {
      handleBack()
      return
    }

    // Save state before processing answer
    saveStateSnapshot(questionKey, answer)

    // Update question number and track answer
    quizState.value.questionNumber++
    quizState.value.sessionAnswers.push({
      question: questionKey,
      answer
    })

    // Handle "don't know" count
    if (answer === '?') {
      quizState.value.dontKnowCount++
    } else {
      quizState.value.dontKnowCount = 0 // Reset on definitive answer
    }

    // Process the answer and update scores
    const { eliminated, newScores } = questionScoring.processAnswer(
      questionKey,
      answer,
      dataLoader.cosmologies.value,
      quizState.value.scores
    )

    quizState.value.scores = newScores

    // Update conviction profile
    updateConvictionProfile(question, answer)

    // Process mutual exclusions if user answered Yes
    if (answer === 'Y' && question.excludes) {
      processExclusions(question.excludes)
    }

    // Apply concept boosts and eliminations
    applyConceptBoosts()
    eliminateRejectedConceptCosmologies()

    // Mark question as asked
    quizState.value.askedQuestions.push(questionKey)

    // Find next question
    await findNextQuestion()
  }

  const updateConvictionProfile = (question: any, answer: QuizAnswer): void => {
    if (answer === '?') return

    for (const concept of question.concepts) {
      const tag = concept.tag
      const polarity = concept.polarity

      // Initialize if not exists
      if (!(tag in quizState.value.convictionProfile)) {
        quizState.value.convictionProfile[tag] = { pro: 0, con: 0 }
      }

      quizState.value.askedConcepts.add(tag)

      if (answer === 'Y') {
        quizState.value.convictionProfile[tag][polarity]++
      } else if (answer === 'N') {
        const opposite = polarity === 'pro' ? 'con' : 'pro'
        quizState.value.convictionProfile[tag][opposite]++
      }
    }
  }

  const processExclusions = (excludes: any): void => {
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
        quizState.value.convictionProfile[conceptTag] = { pro: 0, con: 0 }
      }
      quizState.value.convictionProfile[conceptTag].con += 2
    }

    // Eliminate excluded cosmologies directly
    const excludedCosmologies = excludes.cosmologies || []
    for (const cosmologyName of excludedCosmologies) {
      const index = dataLoader.cosmologies.value.findIndex(c => c.Cosmology === cosmologyName)
      if (index !== -1 && quizState.value.scores[index] > CONFIG.SCORE_ELIMINATE) {
        quizState.value.scores[index] = CONFIG.SCORE_ELIMINATE
      }
    }

    // Eliminate cosmologies that require excluded concepts
    for (const conceptTag of excludedConcepts) {
      eliminateCosmologiesRequiringConcept(conceptTag)
    }
  }

  const eliminateCosmologiesRequiringConcept = (conceptTag: string): void => {
    for (const [questionKey, question] of Object.entries(dataLoader.questions.value)) {
      if (!(questionKey in dataLoader.cosmologies.value[0])) continue

      for (const concept of question.concepts) {
        if (concept.tag === conceptTag && concept.polarity === 'pro') {
          // Eliminate cosmologies that REQUIRE this concept
          dataLoader.cosmologies.value.forEach((cosmology, i) => {
            if (quizState.value.scores[i] <= CONFIG.SCORE_ELIMINATE) return

            const relation = cosmology[questionKey]
            if (relation === 'R') {
              quizState.value.scores[i] = CONFIG.SCORE_ELIMINATE
            }
          })
        }
      }
    }
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

  const eliminateRejectedConceptCosmologies = (): void => {
    for (const [conceptTag, counts] of Object.entries(quizState.value.convictionProfile)) {
      const conCount = counts.con

      if (conCount >= CONFIG.CONCEPT_ELIMINATION_THRESHOLD) {
        eliminateCosmologiesRequiringConcept(conceptTag)
      }
    }
  }

  const saveStateSnapshot = (question: string, answer: QuizAnswer): void => {
    const snapshot: QuizStateSnapshot = {
      question,
      answer,
      scores: [...quizState.value.scores],
      convictionProfile: JSON.parse(JSON.stringify(quizState.value.convictionProfile)),
      askedQuestions: [...quizState.value.askedQuestions],
      askedConcepts: new Set(quizState.value.askedConcepts),
      dontKnowCount: quizState.value.dontKnowCount,
      questionNumber: quizState.value.questionNumber
    }
    quizState.value.questionHistory.push(snapshot)
  }

  const handleBack = (): boolean => {
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

    // Remove the last answer from session
    quizState.value.sessionAnswers.pop()

    return true
  }

  const getActiveCosmologies = (): Cosmology[] => {
    return dataLoader.cosmologies.value.filter((_, i) => 
      quizState.value.scores[i] > CONFIG.SCORE_ELIMINATE
    )
  }

  const getPotentialQuestions = (): string[] => {
    const questionColumns = dataLoader.getQuestionColumns()
    const filtered = questionColumns.filter(q => 
      !quizState.value.askedQuestions.includes(q) && 
      q in dataLoader.questions.value
    )
    
    console.log('Question filtering debug:', {
      allColumns: questionColumns.length,
      askedQuestions: quizState.value.askedQuestions,
      questionsInLibrary: Object.keys(dataLoader.questions.value).length,
      filteredCount: filtered.length,
      sampleFiltered: filtered.slice(0, 5)
    })
    
    return filtered
  }

  const shouldStopQuiz = (): boolean => {
    const remaining = getActiveCosmologies().length
    console.log('shouldStopQuiz check:', {
      remaining,
      questionNumber: quizState.value.questionNumber,
      totalCosmologies: dataLoader.cosmologies.value.length,
      scoresLength: quizState.value.scores.length,
      sampleScores: quizState.value.scores.slice(0, 5)
    })
    
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
    getActiveCosmologies
  }
}