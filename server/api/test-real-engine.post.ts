/**
 * Server API that calls the frontend to test the ACTUAL quiz engine
 * This endpoint makes an HTTP request to the frontend to use runAutoQuiz
 */

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { answerProfile, cosmologyName } = body
    
    if (!answerProfile) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing answerProfile parameter'
      })
    }
    
    console.log(`🎯 Testing ${cosmologyName || 'Unknown'} with REAL quiz engine`)
    console.log(`   Answer profile has ${Object.keys(answerProfile).length} questions`)
    
    // Use the existing auto-quiz endpoint that should call the real frontend composable
    const autoQuizUrl = `${getRequestURL(event).origin}/api/auto-quiz`
    
    console.log('🚀 Calling real auto-quiz endpoint...')
    const response = await $fetch(autoQuizUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        answerProfile: answerProfile
      }
    })
    
    if (!response.success) {
      throw createError({
        statusCode: 500,
        statusMessage: `Auto-quiz failed: ${response.message}`
      })
    }
    
    const result = response.data
    
    console.log('✅ Auto-quiz completed:')
    console.log(`   Questions asked: ${result.totalQuestions}`)
    console.log(`   Answer string: ${result.answerString}`)
    console.log(`   Top result: ${result.finalResults[0]?.cosmology || 'Unknown'}`)
    
    // Check for the target cosmology if provided
    if (cosmologyName) {
      const targetResult = result.finalResults.find(r => r.cosmology === cosmologyName)
      if (targetResult) {
        const rank = result.finalResults.findIndex(r => r.cosmology === cosmologyName) + 1
        console.log(`   ${cosmologyName}: Rank #${rank}, Score ${targetResult.score}`)
      } else {
        console.log(`   ${cosmologyName}: Not found in results`)
      }
    }
    
    return {
      success: true,
      data: {
        questionsAsked: result.questionsAsked,
        answersGiven: result.answersGiven,
        answerString: result.answerString,
        finalResults: result.finalResults,
        totalQuestions: result.totalQuestions,
        permalink: result.permalink,
        cosmologyName: cosmologyName || null
      }
    }
    
  } catch (error) {
    console.error('Test real engine API error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})