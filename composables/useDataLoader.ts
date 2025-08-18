import type { 
  Cosmology, 
  QuestionLibrary, 
  CosmologyDescription, 
  CategoryDescription 
} from '~/types'

export const useDataLoader = () => {
  const cosmologies = useState<Cosmology[]>('cosmologies', () => [])
  const questions = useState<QuestionLibrary>('questions', () => ({}))
  const summaries = useState<CosmologyDescription>('summaries', () => ({}))
  const fullDescriptions = useState<CategoryDescription>('fullDescriptions', () => ({}))
  const isLoading = useState('dataLoading', () => false)
  const error = useState<string | null>('dataError', () => null)

  const loadAllData = async (): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Load all data files in parallel with cache busting
      const cacheBuster = `?v=${Date.now()}`
      const [rawCosmologiesData, questionsData, summariesData, descriptionsData] = await Promise.all([
        $fetch<any>(`/data/cosmology_features.json${cacheBuster}`),
        $fetch<QuestionLibrary>(`/data/question_library_v3.json${cacheBuster}`),
        $fetch<CosmologyDescription>(`/data/description_library.json${cacheBuster}`),
        $fetch<CategoryDescription>(`/data/full_description_library.json${cacheBuster}`)
      ]);
      
      // Debug logging for production issues
      console.log('Raw cosmologies data structure:', {
        hasCosmologies: !!rawCosmologiesData.cosmologies,
        type: typeof rawCosmologiesData,
        keys: Object.keys(rawCosmologiesData || {}),
        cosmologiesLength: rawCosmologiesData.cosmologies?.length,
        isArray: Array.isArray(rawCosmologiesData),
        firstKey: Object.keys(rawCosmologiesData || {})[0]
      });
      
      // Handle different data formats (direct array vs object with cosmologies property)
      let cosmologiesArray: any[];
      if (Array.isArray(rawCosmologiesData)) {
        // Direct array format
        cosmologiesArray = rawCosmologiesData;
      } else if (rawCosmologiesData.cosmologies && Array.isArray(rawCosmologiesData.cosmologies)) {
        // Object with cosmologies property
        cosmologiesArray = rawCosmologiesData.cosmologies;
      } else if (typeof rawCosmologiesData === 'object' && Object.keys(rawCosmologiesData).length > 0) {
        // Object with numeric keys (converted array)
        cosmologiesArray = Object.values(rawCosmologiesData);
      } else {
        throw new Error(`Invalid cosmologies data structure. Expected array or object with cosmologies property`);
      }
      
      console.log('Using cosmologies array:', {
        length: cosmologiesArray.length,
        firstItem: cosmologiesArray[0],
        firstItemKeys: Object.keys(cosmologiesArray[0] || {})
      });
      
      // Transform the raw data into the flat structure the app expects
      const transformedCosmologies = cosmologiesArray.map((cosmo: any) => {
        return {
          Order: String(cosmo.order),
          Category: cosmo.category,
          Cosmology: cosmo.cosmology,
          ...cosmo.assignments
        };
      });

      cosmologies.value = transformedCosmologies;
      questions.value = questionsData;
      summaries.value = summariesData;
      fullDescriptions.value = descriptionsData;
      
      console.log('After transformation:', {
        cosmologiesLength: cosmologies.value.length,
        firstCosmology: cosmologies.value[0],
        firstCosmologyKeys: Object.keys(cosmologies.value[0] || {}),
        questionsKeys: Object.keys(questions.value).slice(0, 5)
      });

      // Validate data
      const isValid = validateData()
      
      if (isValid) {
        console.log(`✓ Loaded ${cosmologies.value.length} cosmologies, ${Object.keys(questions.value).length} questions`)
        return true
      } else {
        error.value = 'Data validation failed'
        return false
      }
    } catch (err) {
      error.value = `Failed to load data: ${err}`
      console.error('Data loading error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const validateData = (): boolean => {
    // Validate cosmologies
    if (!cosmologies.value || cosmologies.value.length === 0) {
      console.error('No cosmologies loaded')
      return false
    }

    // Check required columns
    const requiredCols = ['Order', 'Category', 'Cosmology']
    const firstCosmology = cosmologies.value[0]
    if (!firstCosmology) {
      console.error('Cosmology data is empty or invalid.')
      return false
    }
    for (const col of requiredCols) {
      if (!(col in firstCosmology)) {
        console.error(`Missing required column: ${col}`)
        return false
      }
    }

    // Validate questions
    if (!questions.value || Object.keys(questions.value).length === 0) {
      console.error('No questions loaded')
      return false
    }

    // Validate question structure
    for (const [key, question] of Object.entries(questions.value)) {
      if (!question.question || !question.clarification || !question.concepts) {
        console.error(`Invalid question structure: ${key}`)
        return false
      }
    }

    return true
  }

  const getQuestionColumns = (): string[] => {
    if (cosmologies.value.length === 0) return []
    
    const firstCosmology = cosmologies.value[0]
    const excludeCols = ['Order', 'Category', 'Cosmology']
    
    const columns = Object.keys(firstCosmology).filter(col => !excludeCols.includes(col))
    
    console.log('Question columns debug:', {
      totalColumns: Object.keys(firstCosmology).length,
      excludedColumns: excludeCols,
      questionColumns: columns.length,
      sampleColumns: columns.slice(0, 5),
      firstCosmologyKeys: Object.keys(firstCosmology).slice(0, 10),
      sampleQuestionKeys: Object.keys(questions.value).slice(0, 5)
    })
    
    return columns
  }

  const calculateConceptualDistances = (): Map<string, number> => {
    // Simplified conceptual distance calculation
    // In the full implementation, this would calculate distances between cosmologies
    // based on their feature similarities
    const distances = new Map<string, number>()
    
    for (let i = 0; i < cosmologies.value.length; i++) {
      for (let j = i + 1; j < cosmologies.value.length; j++) {
        const key = `${i}-${j}`
        // Placeholder calculation - in reality this would compare feature vectors
        distances.set(key, Math.random() * 0.5 + 0.25)
      }
    }
    
    return distances
  }

  return {
    cosmologies: readonly(cosmologies),
    questions: readonly(questions),
    summaries: readonly(summaries),
    fullDescriptions: readonly(fullDescriptions),
    isLoading: readonly(isLoading),
    error: readonly(error),
    loadAllData,
    getQuestionColumns,
    calculateConceptualDistances
  }
}