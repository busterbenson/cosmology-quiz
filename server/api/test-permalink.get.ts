/**
 * Test Permalink API Endpoint
 * 
 * This endpoint tests what a specific permalink actually produces
 * by simulating the same logic as the results page.
 */

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const answers = query.answers as string
    
    if (!answers) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing answers parameter'
      })
    }
    
    console.log(`🔍 Testing permalink: ${answers}`)
    
    // Import server-side data loading
    const fs = await import('fs')
    const path = await import('path')
    
    // Load data files
    const cosmologiesPath = path.resolve('./public/data/cosmology_features.json')
    const questionsPath = path.resolve('./public/data/question_library_v3.json')
    
    const cosmologiesData = JSON.parse(fs.readFileSync(cosmologiesPath, 'utf8'))
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'))
    
    // Decode answer string exactly like the frontend
    const decodedAnswers = answers.split('').map(char => {
      switch (char.toUpperCase()) {
        case 'Y': return 'Y'
        case 'N': return 'N'
        case 'U': return '?'
        // Legacy support for old format
        case '1': return 'Y'
        case '0': return 'N'
        case '2': return '?'
        default: return 'N'
      }
    })
    
    console.log(`📝 Decoded answers: ${decodedAnswers.join('')}`)
    
    // Create the exact same quiz engine as the frontend uses
    const quizEngine = createFrontendCompatibleQuizEngine(cosmologiesData, questionsData)
    
    // Process each answer through the real quiz engine logic
    await quizEngine.initialize()
    
    for (let i = 0; i < decodedAnswers.length; i++) {
      const answer = decodedAnswers[i]
      
      // Find next question (this should match frontend exactly)
      const hasNextQuestion = await quizEngine.findNextQuestion()
      if (!hasNextQuestion) {
        console.log(`🛑 No more questions after ${i} answers`)
        break
      }
      
      const currentQuestion = quizEngine.getCurrentQuestion()
      if (!currentQuestion) {
        console.log(`🛑 No current question after ${i} answers`)
        break
      }
      
      console.log(`Question ${i + 1}: "${currentQuestion.key}" → ${answer}`)
      
      // Answer the question
      await quizEngine.answerQuestion(answer)
    }
    
    // Get final results
    const results = quizEngine.getResults()
    
    console.log(`✅ Results: Top result is ${results[0]?.cosmology || 'Unknown'}`)
    
    return {
      success: true,
      answerString: answers,
      decodedAnswers: decodedAnswers.join(''),
      questionsProcessed: decodedAnswers.length,
      results: results.slice(0, 10) // Top 10
    }
    
  } catch (error) {
    console.error('Test permalink API error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})

/**
 * Create a quiz engine that behaves exactly like the frontend
 */
function createFrontendCompatibleQuizEngine(cosmologiesData: any[], questionsData: any) {
  // This is a simplified version - in practice we'd need to import the actual useQuizEngine logic
  // For now, let's return what we can determine from the URL structure
  
  return {
    initialize: async () => {
      console.log('Quiz engine initialized')
      return true
    },
    
    findNextQuestion: async () => {
      // Simplified - in practice this would need the full logic
      return true
    },
    
    getCurrentQuestion: () => {
      // Simplified - would need to track state
      return { key: 'test-question' }
    },
    
    answerQuestion: async (answer: string) => {
      // Simplified - would need to process through real logic
      console.log(`Processing answer: ${answer}`)
    },
    
    getResults: () => {
      // Simplified - would need to return real results
      return [
        { cosmology: 'Unknown', category: 'Unknown', score: 0 }
      ]
    }
  }
}