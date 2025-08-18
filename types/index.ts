// Core data types for the Cosmology Quiz

export interface Cosmology {
  Order: string
  Category: string
  Cosmology: string
  [questionKey: string]: string // All the question columns (R, NR, DB, or empty)
}

export interface QuestionConcept {
  tag: string
  polarity: 'pro' | 'con'
}

export interface QuestionExcludes {
  questions?: string[]
  concepts?: string[]
  cosmologies?: string[]
}

export interface Question {
  question: string
  clarification: string
  concepts: QuestionConcept[]
  excludes?: QuestionExcludes
  id?: number
}

export interface QuestionLibrary {
  [questionKey: string]: Question
}

export interface CosmologyDescription {
  [cosmologyName: string]: string
}

export interface CategoryDescription {
  [categoryName: string]: string
}

// Quiz engine state types
export interface ConvictionCount {
  pro: number
  con: number
}

export interface ConvictionProfile {
  [concept: string]: ConvictionCount
}

export interface QuizState {
  scores: number[]
  askedQuestions: string[]
  sessionAnswers: Array<{ questionId: number; answer: string }>
  convictionProfile: ConvictionProfile
  askedConcepts: string[] // Changed from Set to Array for serialization
  dontKnowCount: number
  questionNumber: number
  questionHistory: QuizStateSnapshot[]
  rankingHistory: string[][] // Track top 5 cosmologies after each question
  rankingStabilityCount: number // How many consecutive questions with stable rankings
  lastEliminationCount: number // Track how many were eliminated in the last round
  noProgressCount: number // How many consecutive questions with no eliminations AND no ranking changes
  tieBreakerMode: boolean // Whether we're in tie-breaking differentiation mode
  tieBreakerQuestionsAsked: number // How many questions asked in tie-breaker mode
  coverageQuestionsAsked: number // How many coverage questions asked in this quiz
  coveredCategoryGroups: string[] // Which major category groups have been covered
}

export interface QuizStateSnapshot {
  question: string
  answer: string
  scores: number[]
  convictionProfile: ConvictionProfile
  askedQuestions: string[]
  askedConcepts: string[] // Changed from Set to Array for serialization
  dontKnowCount: number
  questionNumber: number
  rankingHistory: string[][]
  rankingStabilityCount: number
  lastEliminationCount: number
  noProgressCount: number
  tieBreakerMode: boolean
  tieBreakerQuestionsAsked: number
  coverageQuestionsAsked: number
  coveredCategoryGroups: string[]
}

export interface QuestionScore {
  totalScore: number
  productScore: number
  entropyModifier: number
  bonuses: QuestionBonuses
  uncertaintyBonus: number
  predictablePenalty: number
  pYes: number
  pNo: number
  yesEliminated: number
  noEliminated: number
  potentialEliminations?: number
  differentiationScore?: number
  differentiationEfficiency?: number
  boostedCount?: number
  requiredQuestionBoost?: number
  requiredCosmologyMatches?: number
  coverageBoost?: number
  isCoverageQuestion?: boolean
}

export interface QuestionBonuses {
  totalBonus: number
  consistencyBonus: number
  convictionPenalty: number
  drillDownBonus: number
  noveltyBonus: number
}

export interface QuizResult {
  cosmology: string
  category: string
  score: number
}

export interface TraditionGroup {
  [traditionName: string]: QuizResult[]
}

// Enhanced results display types
export interface CosmologicalProfileItem {
  concept: string
  stance: 'For' | 'Against' | 'Neutral'
  netScore: number
  pro: number
  con: number
  strength: number
}

// Configuration constants (matching Python config)
export const CONFIG = {
  SCORE_ELIMINATE: -1000,
  SCORE_HEAVY_PENALTY: -100,
  CLEAR_WINNER_THRESHOLD: 5,
  DIMINISHING_RETURNS_THRESHOLD: 2,
  MINIMUM_QUESTIONS: 10,
  
  // Bonuses and Penalties
  NOVELTY_BONUS: 1.5,
  CONSISTENCY_BONUS: 4.0,
  DRILL_DOWN_BONUS: 2.0,
  CONVICTION_PENALTY_FACTOR: 4,
  STRONG_STANCE_THRESHOLD: 2,
  UNYIELDING_STANCE_THRESHOLD: 3,
  CONCEPT_ELIMINATION_THRESHOLD: 3,
  CONCEPT_BOOST_FACTOR: 1.5,
  
  // Information Theory Parameters
  ENTROPY_WEIGHT: 0.3,
  PREDICTABLE_QUESTION_PENALTY: 0.1,
  MIN_PROBABILITY: 0.001,
  UNCERTAINTY_BONUS: 1.2,
  UNCERTAINTY_PENALTY: -2,
  
  // Confidence Interval Settings
  MIN_CONFIDENCE: 0.6,
  CONFIDENCE_QUESTIONS_FACTOR: 0.1,
  STABILITY_WINDOW: 5,
  
  // Tie Resolution
  MAX_TIE_COSMOLOGIES: 5,
  CONCEPTUAL_DISTANCE_THRESHOLD: 0.7,
  
  // User Experience
  MAX_DONT_KNOW_STREAK: 3,
  PROGRESS_UPDATE_FREQUENCY: 1,
  VISUAL_WIDTH: 60,
  
  // Early Stopping Conditions
  STOP_ON_ZERO_ELIMINATIONS: true,     // Stop when no progress is made
  RANKING_STABILITY_ENABLED: true,     // Check for progress (eliminations + ranking changes)
  RANKING_STABILITY_COUNT: 5,          // Track top N cosmologies for ranking changes
  RANKING_STABILITY_THRESHOLD: 3,      // Questions with no progress to trigger stop
  
  // Tie-breaking mode when top cosmologies are close
  TIE_BREAKING_MODE_ENABLED: true,     // Enable tie-breaking differentiation mode
  TIE_SCORE_THRESHOLD: 20,             // Points difference to consider cosmologies "tied"
  TIE_BREAKING_MIN_TIED: 3,            // Minimum number of tied cosmologies to trigger mode
  TIE_BREAKING_MAX_QUESTIONS: 10,      // Maximum additional questions in tie-breaking mode
  
  // Question Selection Weights
  EARLY_GAME_THRESHOLD: 50,            // More than this many cosmologies = early game
  LATE_GAME_THRESHOLD: 10,             // Less than this many cosmologies = late game
  ELIMINATION_WEIGHT_EARLY: 0.7,       // Weight for elimination score in early game
  DIFFERENTIATION_WEIGHT_EARLY: 0.2,   // Weight for differentiation score in early game
  ENTROPY_WEIGHT_EARLY: 0.1,           // Weight for entropy score in early game
  ELIMINATION_WEIGHT_MID: 0.4,         // Weight for elimination score in mid game
  DIFFERENTIATION_WEIGHT_MID: 0.4,     // Weight for differentiation score in mid game
  ENTROPY_WEIGHT_MID: 0.2,             // Weight for entropy score in mid game
  ELIMINATION_WEIGHT_LATE: 0.05,       // Weight for elimination score in late game
  DIFFERENTIATION_WEIGHT_LATE: 0.85,   // Weight for differentiation score in late game  
  ENTROPY_WEIGHT_LATE: 0.1,            // Weight for entropy score in late game
  TOP_COSMOLOGIES_TO_CONSIDER: 10,     // Number of top cosmologies to consider for differentiation
  TIE_BREAKER_TOP_COSMOLOGIES: 20,     // Number of top cosmologies to consider in tie-breaker mode
  MIN_DIFFERENTIATION_EFFICIENCY: 0.3, // Minimum efficiency to consider question viable
  POINTS_PER_REQUIRED: 10,             // Points awarded for Required relation
  POINTS_PER_DEAL_BREAKER: 10,         // Points awarded for Deal Breaker relation
  
  // Required Question Boost System
  REQUIRED_QUESTION_BOOST_ENABLED: true,   // Enable boosting Required questions for lower-ranked cosmologies
  REQUIRED_QUESTION_BOOST_WEIGHT: 0.3,     // Weight for Required question boost in total score
  REQUIRED_QUESTION_BOOST_SCALE: 200,      // Base boost points for Required questions (increased from 50)
  REQUIRED_QUESTION_BOOST_RANGE: 30,       // Consider Required questions for cosmologies ranked 1-30
  REQUIRED_QUESTION_RANK_BOOST_FACTOR: 1.0, // Boost factor increases with lower rank (increased from 0.5)
  
  // Coverage Phase System
  COVERAGE_PHASE_ENABLED: true,            // Master switch for coverage phase
  COVERAGE_PHASE_TRIGGER_THRESHOLD: 80,    // Trigger when ≤ N cosmologies remain (increased from 30)
  COVERAGE_PHASE_TOP_N: 20,               // Consider categories with cosmologies in top N
  COVERAGE_PHASE_BOOST_SCALE: 500,        // Massive boost for coverage questions
  COVERAGE_PHASE_MAX_QUESTIONS: 9,        // Maximum coverage questions per quiz (increased from 5)
} as const

export type QuizAnswer = 'Y' | 'N' | '?' | 'B'
export type RelationType = 'R' | 'NR' | 'DB' | ''