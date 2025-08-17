/**
 * Auto Quiz API Endpoint
 * 
 * Accepts a complete answer profile and runs it through the real quiz engine,
 * returning the results including permalink and top cosmologies.
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body.answerProfile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing answerProfile in request body'
      })
    }
    
    // Import server-side data loading
    const fs = await import('fs')
    const path = await import('path')
    
    // Load data files
    const cosmologiesPath = path.resolve('./public/data/cosmology_features.json')
    const questionsPath = path.resolve('./public/data/question_library_v3.json')
    
    const cosmologiesData = JSON.parse(fs.readFileSync(cosmologiesPath, 'utf8'))
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))
    
    // Create a server-side quiz engine instance
    const quizEngine = createServerSideQuizEngine(cosmologiesData, questionsData)
    
    // Run the auto-quiz
    const result = await quizEngine.runAutoQuiz(body.answerProfile)
    
    return {
      success: true,
      data: result
    }
    
  } catch (error) {
    console.error('Auto-quiz API error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})

/**
 * Create a server-side version of the quiz engine
 */
function createServerSideQuizEngine(cosmologiesData: any[], questionsData: any) {
  // Import CONFIG from types
  const CONFIG = {
    SCORE_ELIMINATE: -1000,
    SCORE_HEAVY_PENALTY: -100,
    CLEAR_WINNER_THRESHOLD: 5,
    DIMINISHING_RETURNS_THRESHOLD: 2,
    MINIMUM_QUESTIONS: 10,
    NOVELTY_BONUS: 1.5,
    CONSISTENCY_BONUS: 4.0,
    DRILL_DOWN_BONUS: 2.0,
    CONVICTION_PENALTY_FACTOR: 4,
    STRONG_STANCE_THRESHOLD: 2,
    UNYIELDING_STANCE_THRESHOLD: 3,
    CONCEPT_ELIMINATION_THRESHOLD: 3,
    CONCEPT_BOOST_FACTOR: 1.5,
    ENTROPY_WEIGHT: 0.3,
    PREDICTABLE_QUESTION_PENALTY: 0.1,
    MIN_PROBABILITY: 0.001,
    UNCERTAINTY_BONUS: 1.2,
    UNCERTAINTY_PENALTY: -2
  }
  
  // Server-side quiz state
  let quizState = {
    scores: new Array(cosmologiesData.length).fill(0),
    askedQuestions: ['Order', 'Category', 'Cosmology'],
    sessionAnswers: [],
    convictionProfile: {},
    askedConcepts: new Set<string>(),
    dontKnowCount: 0,
    questionNumber: 0,
    questionHistory: []
  }
  
  const getQuestionColumns = () => {
    return Object.keys(cosmologiesData[0]).filter(k => 
      !['Order', 'Category', 'Cosmology'].includes(k)
    )
  }
  
  const getActiveCosmologies = () => {
    return cosmologiesData.filter((_, i) => 
      quizState.scores[i] > CONFIG.SCORE_ELIMINATE
    )
  }
  
  const scoreQuestion = (questionKey: string, question: any, activeCosmologies: any[], 
                        convictionProfile: any, askedConcepts: Set<string>, dontKnowCount: number) => {
    const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length
    const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length
    const totalActive = activeCosmologies.length
    
    if (totalActive === 0) {
      return {
        totalScore: 0,
        potentialEliminations: 0
      }
    }
    
    const pYes = Math.max(CONFIG.MIN_PROBABILITY, (totalActive - yesEliminated) / totalActive)
    const pNo = Math.max(CONFIG.MIN_PROBABILITY, (totalActive - noEliminated) / totalActive)
    
    const entropyYes = pYes > 0 ? -(pYes * Math.log2(pYes)) : 0
    const entropyNo = pNo > 0 ? -(pNo * Math.log2(pNo)) : 0
    const entropyModifier = CONFIG.ENTROPY_WEIGHT * (entropyYes + entropyNo)
    
    const productScore = yesEliminated * noEliminated
    const potentialEliminations = Math.max(yesEliminated, noEliminated)
    const totalScore = productScore + entropyModifier
    
    return {
      totalScore,
      potentialEliminations
    }
  }
  
  const findNextQuestion = () => {
    const activeCosmologies = getActiveCosmologies()
    const questionColumns = getQuestionColumns()
    
    const potentialQuestions = questionColumns.filter(q => 
      !quizState.askedQuestions.includes(q) && q in questionsData
    )
    
    if (potentialQuestions.length === 0 || activeCosmologies.length <= 1) {
      return null
    }
    
    // Filter to viable questions
    const viableQuestions = potentialQuestions.filter(questionKey => {
      const yesEliminated = activeCosmologies.filter(c => c[questionKey] === 'DB').length
      const noEliminated = activeCosmologies.filter(c => c[questionKey] === 'R').length
      
      // Skip questions involving concepts user has strongly rejected
      const question = questionsData[questionKey]
      if (question && question.concepts) {
        for (const concept of question.concepts) {
          const tag = concept.tag
          if (tag in quizState.convictionProfile) {
            const conCount = quizState.convictionProfile[tag].con
            if (conCount >= CONFIG.CONCEPT_ELIMINATION_THRESHOLD) {
              return false
            }
          }
        }
      }
      
      return yesEliminated > 0 || noEliminated > 0
    })
    
    if (viableQuestions.length === 0) {
      return null
    }
    
    // Score all viable questions
    let bestQuestion = null
    let bestScore = -1
    let bestImpact = null
    
    for (const questionKey of viableQuestions) {
      const question = questionsData[questionKey]
      if (!question) continue
      
      const impact = scoreQuestion(
        questionKey, question, activeCosmologies,
        quizState.convictionProfile, quizState.askedConcepts, quizState.dontKnowCount
      )
      
      if (impact.totalScore > bestScore) {
        bestScore = impact.totalScore
        bestQuestion = questionKey
        bestImpact = impact
      }
    }
    
    return bestQuestion ? {
      key: bestQuestion,
      question: questionsData[bestQuestion],
      impact: bestImpact
    } : null
  }
  
  const shouldStopQuiz = (currentQuestionImpact?: any) => {
    const remaining = getActiveCosmologies().length
    
    // Stop if only one left
    if (remaining <= 1) {
      return true
    }
    
    // Stop if we've asked too many questions
    if (quizState.questionNumber >= 30) {
      return true
    }
    
    // Check diminishing returns
    if (quizState.questionNumber > CONFIG.MINIMUM_QUESTIONS) {
      if (currentQuestionImpact && currentQuestionImpact.potentialEliminations !== undefined && 
          currentQuestionImpact.potentialEliminations <= CONFIG.DIMINISHING_RETURNS_THRESHOLD) {
        return true
      }
    }
    
    return false
  }
  
  const processAnswer = (questionKey: string, answer: string) => {
    const eliminated = []
    
    if (answer === 'Y' || answer === 'N') {
      cosmologiesData.forEach((cosmology, i) => {
        if (quizState.scores[i] <= CONFIG.SCORE_ELIMINATE) return
        
        const relation = cosmology[questionKey]
        
        if (answer === 'Y') {
          if (relation === 'DB') {
            quizState.scores[i] = CONFIG.SCORE_ELIMINATE
            eliminated.push(cosmology.Cosmology)
          } else if (relation === 'R') {
            quizState.scores[i] += 10
          } else if (relation === 'NR') {
            quizState.scores[i] += 2
          }
        } else if (answer === 'N') {
          if (relation === 'R') {
            quizState.scores[i] = CONFIG.SCORE_ELIMINATE
            eliminated.push(cosmology.Cosmology)
          } else if (relation === 'DB') {
            quizState.scores[i] += 10
          } else if (relation === 'NR') {
            quizState.scores[i] += 2
          }
        }
      })
    }
    
    return eliminated
  }
  
  const updateConvictionProfile = (question: any, answer: string) => {
    if (answer === '?') return
    
    for (const concept of (question.concepts || [])) {
      const tag = concept.tag
      const polarity = concept.polarity
      
      if (!(tag in quizState.convictionProfile)) {
        quizState.convictionProfile[tag] = { pro: 0, con: 0 }
      }
      
      quizState.askedConcepts.add(tag)
      
      if (answer === 'Y') {
        quizState.convictionProfile[tag][polarity]++
      } else if (answer === 'N') {
        const opposite = polarity === 'pro' ? 'con' : 'pro'
        quizState.convictionProfile[tag][opposite]++
      }
    }
  }
  
  const runAutoQuiz = async (answerProfile: Record<string, string>) => {
    console.log('🤖 Server-side auto-quiz starting with', Object.keys(answerProfile).length, 'answers')
    
    // Reset state
    quizState = {
      scores: new Array(cosmologiesData.length).fill(0),
      askedQuestions: ['Order', 'Category', 'Cosmology'],
      sessionAnswers: [],
      convictionProfile: {},
      askedConcepts: new Set<string>(),
      dontKnowCount: 0,
      questionNumber: 0,
      questionHistory: []
    }
    
    const questionsAsked: string[] = []
    const answersGiven: string[] = []
    
    let iterationCount = 0
    const maxIterations = 50
    
    while (iterationCount < maxIterations) {
      // Find next question
      const nextQuestion = findNextQuestion()
      if (!nextQuestion) {
        console.log('🛑 No more questions available')
        break
      }
      
      // Check stopping conditions
      if (shouldStopQuiz(nextQuestion.impact)) {
        console.log('🛑 Stopping conditions met')
        break
      }
      
      const questionKey = nextQuestion.key
      questionsAsked.push(questionKey)
      quizState.askedQuestions.push(questionKey)
      
      // Get answer from profile
      let answer = answerProfile[questionKey] || 'N'
      answersGiven.push(answer)
      
      console.log(`📝 Question ${iterationCount + 1}: "${questionKey}" → ${answer}`)
      
      // Process answer
      processAnswer(questionKey, answer)
      
      // Update conviction profile
      updateConvictionProfile(nextQuestion.question, answer)
      
      // Handle don't know count
      if (answer === '?') {
        quizState.dontKnowCount++
      } else {
        quizState.dontKnowCount = 0
      }
      
      quizState.questionNumber++
      iterationCount++
    }
    
    // Generate final results
    const results = []
    for (let i = 0; i < cosmologiesData.length; i++) {
      const cosmo = cosmologiesData[i]
      if (quizState.scores[i] > CONFIG.SCORE_ELIMINATE) {
        results.push({
          cosmology: cosmo.Cosmology,
          category: cosmo.Category,
          score: quizState.scores[i]
        })
      }
    }
    
    results.sort((a, b) => b.score - a.score)
    
    // Generate answer string
    const answerString = answersGiven.map(a => {
      switch (a) {
        case 'Y': return 'Y'
        case 'N': return 'N'
        case '?': return 'U'
        default: return 'N'
      }
    }).join('')
    
    const permalink = `http://localhost:3000/results?answers=${answerString}`
    
    console.log('✅ Server-side auto-quiz completed:', {
      totalQuestions: questionsAsked.length,
      answerString,
      topResult: results[0]?.cosmology
    })
    
    return {
      questionsAsked,
      answersGiven,
      answerString,
      finalResults: results,
      totalQuestions: questionsAsked.length,
      permalink
    }
  }
  
  return {
    runAutoQuiz
  }
}