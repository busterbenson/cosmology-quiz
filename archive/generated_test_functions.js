
const testBiblicalLiteralism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Biblical Literalism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Biblical Literalism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Biblical Literalism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testAppearanceofAge = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Appearance of Age'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Appearance of Age with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Appearance of Age')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testCatastrophism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Catastrophism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Catastrophism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Catastrophism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEvolutionaryCreationism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Evolutionary Creationism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Evolutionary Creationism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Evolutionary Creationism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testProgressiveCreation = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Progressive Creation'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Progressive Creation with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Progressive Creation')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testTeilhardianEvolution = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Teilhardian Evolution'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Teilhardian Evolution with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Teilhardian Evolution')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testDivineNaturalProcesses = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Divine Natural Processes'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Divine Natural Processes with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Divine Natural Processes')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testGuidedDevelopment = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Guided Development'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Guided Development with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Guided Development')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPurposefulDirection = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Purposeful Direction'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Purposeful Direction with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Purposeful Direction')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testClassicalDeism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Classical Deism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Classical Deism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Classical Deism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testModernDeism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Modern Deism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Modern Deism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Modern Deism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testScientificDeism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Scientific Deism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Scientific Deism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Scientific Deism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testClassicalPolytheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Classical Polytheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Classical Polytheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Classical Polytheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testHenotheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Henotheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Henotheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Henotheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testReconstructionistPolytheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Reconstructionist Polytheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Reconstructionist Polytheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Reconstructionist Polytheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testHardPolytheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Hard Polytheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Hard Polytheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Hard Polytheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testTraditionalAnimism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Traditional Animism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Traditional Animism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Traditional Animism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testNeoAnimism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Neo-Animism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Neo-Animism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Neo-Animism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPanpsychism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Panpsychism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Panpsychism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Panpsychism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testProcessPanentheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Process Panentheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Process Panentheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Process Panentheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEmanationistPanentheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Emanationist Panentheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Emanationist Panentheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Emanationist Panentheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testParticipatoryPanentheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Participatory Panentheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Participatory Panentheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Participatory Panentheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testClassicalPantheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Classical Pantheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Classical Pantheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Classical Pantheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testScientificPantheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Scientific Pantheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Scientific Pantheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Scientific Pantheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testMonisticPantheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Monistic Pantheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Monistic Pantheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Monistic Pantheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testMysticalPantheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Mystical Pantheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Mystical Pantheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Mystical Pantheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testOrganicPantheism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Organic Pantheism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Organic Pantheism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Organic Pantheism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testScientificSpirituality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Scientific Spirituality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Scientific Spirituality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Scientific Spirituality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testNaturalisticBuddhism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Naturalistic Buddhism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Naturalistic Buddhism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Naturalistic Buddhism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPhilosophicalNaturalism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Philosophical Naturalism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Philosophical Naturalism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Philosophical Naturalism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEmbodiedSpirituality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Embodied Spirituality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Embodied Spirituality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Embodied Spirituality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testNaturalisticTaoism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Naturalistic Taoism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Naturalistic Taoism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Naturalistic Taoism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testBuddhistEmptiness = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Buddhist Emptiness'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Buddhist Emptiness with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Buddhist Emptiness')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testDirectExperienceZen = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Direct Experience Zen'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Direct Experience Zen with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Direct Experience Zen')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testVedanticNonDualism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Vedantic Non-Dualism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Vedantic Non-Dualism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Vedantic Non-Dualism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testTantricNonDualism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Tantric Non-Dualism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Tantric Non-Dualism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Tantric Non-Dualism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testTaoistHarmony = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Taoist Harmony'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Taoist Harmony with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Taoist Harmony')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testContemporaryNonDualism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Contemporary Non-Dualism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Contemporary Non-Dualism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Contemporary Non-Dualism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testClassicalGnosticism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Classical Gnosticism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Classical Gnosticism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Classical Gnosticism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPhilosophicalDualism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Philosophical Dualism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Philosophical Dualism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Philosophical Dualism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testModernMatrixSkepticism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Modern Matrix Skepticism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Modern Matrix Skepticism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Modern Matrix Skepticism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testMysticalAgnosticism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Mystical Agnosticism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Mystical Agnosticism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Mystical Agnosticism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPragmaticSpirituality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Pragmatic Spirituality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Pragmatic Spirituality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Pragmatic Spirituality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPhilosophicalSpirituality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Philosophical Spirituality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Philosophical Spirituality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Philosophical Spirituality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testTransitionalSeeking = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Transitional Seeking'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Transitional Seeking with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Transitional Seeking')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEpistemologicalAgnosticism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Epistemological Agnosticism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Epistemological Agnosticism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Epistemological Agnosticism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPerpetualInquiry = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Perpetual Inquiry'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Perpetual Inquiry with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Perpetual Inquiry')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testTechnologicalSimulation = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Technological Simulation'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Technological Simulation with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Technological Simulation')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testDivineSimulation = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Divine Simulation'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Divine Simulation with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Divine Simulation')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testNestedRealities = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Nested Realities'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Nested Realities with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Nested Realities')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testConsciousSimulation = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Conscious Simulation'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Conscious Simulation with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Conscious Simulation')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testYogcraBuddhism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Yogācāra Buddhism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Yogācāra Buddhism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Yogācāra Buddhism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testVajrayanaLuminosity = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Vajrayana Luminosity'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Vajrayana Luminosity with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Vajrayana Luminosity')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testAnalyticalIdealism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Analytical Idealism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Analytical Idealism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Analytical Idealism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testQuantumIdealism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Quantum Idealism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Quantum Idealism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Quantum Idealism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testTranscendentalIdealism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Transcendental Idealism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Transcendental Idealism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Transcendental Idealism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testNeutralMonism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Neutral Monism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Neutral Monism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Neutral Monism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testBuddhistMindOnly = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Buddhist Mind-Only'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Buddhist Mind-Only with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Buddhist Mind-Only')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testLuminousAwareness = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Luminous Awareness'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Luminous Awareness with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Luminous Awareness')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testUniversalMind = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Universal Mind'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Universal Mind with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Universal Mind')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testMindShapedReality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Mind-Shaped Reality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Mind-Shaped Reality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Mind-Shaped Reality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testQuantumManyWorlds = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Quantum Many-Worlds'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Quantum Many-Worlds with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Quantum Many-Worlds')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testCosmicBubbleUniverses = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Cosmic Bubble Universes'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Cosmic Bubble Universes with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Cosmic Bubble Universes')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testHigherDimensionalBranes = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Higher-Dimensional Branes'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Higher-Dimensional Branes with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Higher-Dimensional Branes')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testCyclicalUniverse = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Cyclical Universe'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Cyclical Universe with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Cyclical Universe')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testReductiveMaterialism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Reductive Materialism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Reductive Materialism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Reductive Materialism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEmergentMaterialism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Emergent Materialism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Emergent Materialism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Emergent Materialism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPragmaticInstrumentalism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Pragmatic Instrumentalism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Pragmatic Instrumentalism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Pragmatic Instrumentalism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPoeticNaturalism = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Poetic Naturalism'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Poetic Naturalism with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Poetic Naturalism')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testBiblicalFlatEarth = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Biblical Flat Earth'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Biblical Flat Earth with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Biblical Flat Earth')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testConspiratorialFlatEarth = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Conspiratorial Flat Earth'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Conspiratorial Flat Earth with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Conspiratorial Flat Earth')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testExperientialFlatEarth = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Experiential Flat Earth'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Experiential Flat Earth with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Experiential Flat Earth')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testInterventionOrigins = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Intervention Origins'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Intervention Origins with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Intervention Origins')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testTechnologicalGuidance = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Technological Guidance'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Technological Guidance with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Technological Guidance')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testReligiousFoundations = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Religious Foundations'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Religious Foundations with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Religious Foundations')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testOngoingPresence = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Ongoing Presence'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Ongoing Presence with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Ongoing Presence')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPlaceBasedKnowledge = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Place-Based Knowledge'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Place-Based Knowledge with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Place-Based Knowledge')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testKinshipCosmology = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Kinship Cosmology'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Kinship Cosmology with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Kinship Cosmology')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testCeremonialReality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Ceremonial Reality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Ceremonial Reality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Ceremonial Reality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testAncestralContinuity = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Ancestral Continuity'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Ancestral Continuity with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Ancestral Continuity')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testHiddenHistoryResearcher = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Hidden History Researcher'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Hidden History Researcher with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Hidden History Researcher')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testAlternativePhysicsExplorer = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Alternative Physics Explorer'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Alternative Physics Explorer with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Alternative Physics Explorer')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testConspiracyAnalyst = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Conspiracy Analyst'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Conspiracy Analyst with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Conspiracy Analyst')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testOpenSkeptic = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Open Skeptic'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Open Skeptic with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Open Skeptic')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testItfromBit = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'It from Bit'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing It from Bit with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('It from Bit')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testComputationalUniverse = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Computational Universe'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Computational Universe with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Computational Universe')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEntropicGravity = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Entropic Gravity'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Entropic Gravity with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Entropic Gravity')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testObserverDependentReality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Observer-Dependent Reality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Observer-Dependent Reality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Observer-Dependent Reality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testContinuousCreation = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Continuous Creation'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Continuous Creation with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Continuous Creation')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testDependentExistence = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Dependent Existence'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Dependent Existence with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Dependent Existence')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testDivineQualitiesinCreation = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Divine Qualities in Creation'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Divine Qualities in Creation with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Divine Qualities in Creation')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testLayeredReality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Layered Reality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Layered Reality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Layered Reality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testNaturalProcessSpontaneity = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Natural Process & Spontaneity'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Natural Process & Spontaneity with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Natural Process & Spontaneity')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testPatternCorrespondenceComplementarity = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Pattern Correspondence & Complementarity'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Pattern Correspondence & Complementarity with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Pattern Correspondence & Complementarity')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testIntegralCultivation = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Integral Cultivation'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Integral Cultivation with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Integral Cultivation')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testManySidedReality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Many-Sided Reality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Many-Sided Reality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Many-Sided Reality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEternalUniverse = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Eternal Universe'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Eternal Universe with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Eternal Universe')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testMultipleRealms = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Multiple Realms'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Multiple Realms with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Multiple Realms')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testUniversalLife = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Universal Life'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Universal Life with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Universal Life')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testCommunityAncestralConnection = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Community-Ancestral Connection'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Community-Ancestral Connection with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Community-Ancestral Connection')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testCyclicalSacredTime = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Cyclical-Sacred Time'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Cyclical-Sacred Time with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Cyclical-Sacred Time')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testDivinationBasedCausality = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Divination-Based Causality'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Divination-Based Causality with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Divination-Based Causality')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testVitalityForceCosmology = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Vitality-Force Cosmology'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Vitality-Force Cosmology with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Vitality-Force Cosmology')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testUnityofSelfandCosmos = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Unity of Self and Cosmos'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Unity of Self and Cosmos with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Unity of Self and Cosmos')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testSacredManifestation = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Sacred Manifestation'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Sacred Manifestation with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Sacred Manifestation')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testNaturalHarmony = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Natural Harmony'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Natural Harmony with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Natural Harmony')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testConsciousnessFocused = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Consciousness-Focused'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Consciousness-Focused with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Consciousness-Focused')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEnergyBased = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Energy-Based'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Energy-Based with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Energy-Based')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEvolutionaryConsciousness = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Evolutionary Consciousness'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Evolutionary Consciousness with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Evolutionary Consciousness')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}

const testEclecticSynthesis = async () => {
  testing.value = true
  error.value = null
  results.value = null
  targetCosmology.value = 'Eclectic Synthesis'
  
  try {
    if (!quizEngine.isInitialized.value) {
      const success = await quizEngine.initialize()
      if (!success) {
        throw new Error('Failed to initialize quiz engine')
      }
    }
    
    console.log('🔍 Testing Eclectic Synthesis with REAL quiz engine')
    
    const answerProfile = generateCosmologyProfile('Eclectic Synthesis')
    generatedProfile.value = answerProfile
    console.log('Generated answer profile:', answerProfile)
    
    const result = await quizEngine.runAutoQuiz(answerProfile)
    console.log('✅ Real quiz engine results:', result)
    results.value = result
    
  } catch (err: any) {
    console.error('Test error:', err)
    error.value = err.message
  } finally {
    testing.value = false
  }
}
