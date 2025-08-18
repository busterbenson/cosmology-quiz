import type { Cosmology } from '~/types'
import { CONFIG } from '~/types'

export const useCoveragePhase = () => {
  
  // Major category groups based on philosophical themes
  const MAJOR_CATEGORY_GROUPS = {
    'Theistic': [
      'Young Earth Creationism', 
      'Theistic Evolution', 
      'Deism', 
      'Islamic Philosophical Cosmology'
    ],
    'Consciousness-Based': [
      'Consciousness-First', 
      'Non-Dual & Beyond-Concept',
      'Non-Dual Traditions'
    ],
    'Materialistic': [
      'Scientific Materialism', 
      'Information-Theoretic Cosmology'
    ],
    'Spiritual-Naturalistic': [
      'Spiritual Naturalism', 
      'Pantheism', 
      'Panentheism'
    ],
    'Gnostic-Esoteric': [
      'Gnosticism/Esoteric Dualism'
    ],
    'Skeptical-Agnostic': [
      'Agnostic Spiritual Seeker', 
      'Unconventional Skeptic'
    ],
    'Polytheistic-Indigenous': [
      'Polytheism', 
      'Animism', 
      'Traditional African Cosmologies', 
      'Indigenous Relational Worldview',
      'Traditional Daoist Cosmology',
      'Jain Cosmology'
    ],
    'Alternative-Cosmological': [
      'Simulation Hypothesis', 
      'Multiverse Theory', 
      'Ancient Astronaut Theory', 
      'Flat Earth Conspiracy'
    ],
    'New-Age-Spiritual': [
      'New Age Spiritualism'
    ]
  } as const

  // Representative questions for each major group (most defining/characteristic question)
  const REPRESENTATIVE_QUESTIONS = {
    'Theistic': 'One supreme being',
    'Consciousness-Based': 'Consciousness fundamental to reality', 
    'Materialistic': 'Physical matter/energy as fundamental',
    'Spiritual-Naturalistic': 'Divine permeates and transcends universe',
    'Gnostic-Esoteric': 'Reality divided between spirit and matter',
    'Skeptical-Agnostic': 'Personal truth over dogma',
    'Polytheistic-Indigenous': 'Multiple distinct deities',
    'Alternative-Cosmological': 'Aliens intervened in human evolution',
    'New-Age-Spiritual': 'Reality is energy/vibrational'
  } as const

  /**
   * Identify which major category groups have viable cosmologies 
   * Considers all active cosmologies for category identification, but prioritizes by top performers
   */
  const identifyViableCategoryGroups = (
    allActiveCosmologies: Array<Cosmology & { score: number, rank: number }>
  ): Array<{group: string, cosmologies: string[], highestRank: number, hasTopRanked: boolean}> => {
    if (!CONFIG.COVERAGE_PHASE_ENABLED || allActiveCosmologies.length === 0) {
      return []
    }

    // Identify top N for prioritization, but consider all for category identification
    const topN = allActiveCosmologies.slice(0, CONFIG.COVERAGE_PHASE_TOP_N)
    const topNSet = new Set(topN.map(c => c.Cosmology))
    
    const viableGroups: Array<{group: string, cosmologies: string[], highestRank: number, hasTopRanked: boolean}> = []

    Object.entries(MAJOR_CATEGORY_GROUPS).forEach(([groupName, categories]) => {
      // Find ALL cosmologies in this category group (not just top N)
      const cosmologiesInGroup = allActiveCosmologies.filter(cosmology => 
        categories.includes(cosmology.Category)
      )

      if (cosmologiesInGroup.length > 0) {
        // Check if any cosmologies in this group are in the top N
        const hasTopRanked = cosmologiesInGroup.some(c => topNSet.has(c.Cosmology))
        
        // Find the highest-ranked (lowest rank number) cosmology in this group
        const highestRank = Math.min(...cosmologiesInGroup.map(c => c.rank))
        
        viableGroups.push({
          group: groupName,
          cosmologies: cosmologiesInGroup.map(c => c.Cosmology),
          highestRank,
          hasTopRanked
        })
      }
    })

    // Sort by: 1) Groups with top-ranked cosmologies first, 2) Then by highest rank
    viableGroups.sort((a, b) => {
      if (a.hasTopRanked && !b.hasTopRanked) return -1
      if (!a.hasTopRanked && b.hasTopRanked) return 1
      return a.highestRank - b.highestRank
    })
    
    return viableGroups
  }

  /**
   * Check which category groups haven't had their representative questions asked
   */
  const getUncoveredCategoryGroups = (
    viableGroups: Array<{group: string, cosmologies: string[], highestRank: number, hasTopRanked: boolean}>,
    askedQuestions: string[]
  ): Array<{group: string, cosmologies: string[], highestRank: number, hasTopRanked: boolean}> => {
    return viableGroups.filter(groupInfo => {
      const representativeQuestion = REPRESENTATIVE_QUESTIONS[groupInfo.group as keyof typeof REPRESENTATIVE_QUESTIONS]
      return !askedQuestions.includes(representativeQuestion)
    })
  }

  /**
   * Select the next coverage category to ask about (highest priority uncovered group)
   */
  const selectNextCoverageCategory = (
    uncoveredGroups: Array<{group: string, cosmologies: string[], highestRank: number, hasTopRanked: boolean}>
  ): {group: string, cosmologies: string[], highestRank: number, hasTopRanked: boolean} | null => {
    if (uncoveredGroups.length === 0) {
      return null
    }
    
    // Return the group with the highest-ranked cosmology (already sorted)
    return uncoveredGroups[0]
  }

  /**
   * Get the representative question for a category group
   */
  const getRepresentativeQuestion = (categoryGroup: string): string | null => {
    return REPRESENTATIVE_QUESTIONS[categoryGroup as keyof typeof REPRESENTATIVE_QUESTIONS] || null
  }

  /**
   * Main function to find the next coverage question that should be prioritized
   */
  const findNextCoverageQuestion = (
    topCosmologies: Array<Cosmology & { score: number, rank: number }>,
    askedQuestions: string[]
  ): string | null => {
    if (!CONFIG.COVERAGE_PHASE_ENABLED) {
      return null
    }

    // 1. Identify viable category groups
    const viableGroups = identifyViableCategoryGroups(topCosmologies)
    if (viableGroups.length === 0) {
      return null
    }

    // 2. Find uncovered category groups
    const uncoveredGroups = getUncoveredCategoryGroups(viableGroups, askedQuestions)
    if (uncoveredGroups.length === 0) {
      return null // All viable groups are already covered
    }

    // 3. Select the next coverage category to ask about
    const nextCategory = selectNextCoverageCategory(uncoveredGroups)
    if (!nextCategory) {
      return null
    }

    // 4. Get the representative question for this category
    const representativeQuestion = getRepresentativeQuestion(nextCategory.group)
    
    return representativeQuestion
  }

  /**
   * Check if a question is a coverage question (used for applying coverage boost)
   */
  const isCoverageQuestion = (questionKey: string): boolean => {
    return Object.values(REPRESENTATIVE_QUESTIONS).includes(questionKey)
  }

  /**
   * Get coverage information for debugging/logging
   */
  const getCoverageInfo = (
    topCosmologies: Array<Cosmology & { score: number, rank: number }>,
    askedQuestions: string[]
  ) => {
    const viableGroups = identifyViableCategoryGroups(topCosmologies)
    const uncoveredGroups = getUncoveredCategoryGroups(viableGroups, askedQuestions)
    
    return {
      viableGroups,
      uncoveredGroups,
      totalViableGroups: viableGroups.length,
      totalUncoveredGroups: uncoveredGroups.length,
      allGroupsCovered: uncoveredGroups.length === 0
    }
  }

  return {
    findNextCoverageQuestion,
    isCoverageQuestion,
    getCoverageInfo,
    MAJOR_CATEGORY_GROUPS,
    REPRESENTATIVE_QUESTIONS
  }
}