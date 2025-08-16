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
  sessionAnswers: Array<{ question: string; answer: string }>
  convictionProfile: ConvictionProfile
  askedConcepts: Set<string>
  dontKnowCount: number
  questionNumber: number
  questionHistory: QuizStateSnapshot[]
}

export interface QuizStateSnapshot {
  question: string
  answer: string
  scores: number[]
  convictionProfile: ConvictionProfile
  askedQuestions: string[]
  askedConcepts: Set<string>
  dontKnowCount: number
  questionNumber: number
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
  VISUAL_WIDTH: 60
} as const

export type QuizAnswer = 'Y' | 'N' | '?' | 'B'
export type RelationType = 'R' | 'NR' | 'DB' | ''