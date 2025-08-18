# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cosmology Quiz is a sophisticated Vue/Nuxt 3 web application that helps users discover their philosophical worldview through intelligent questioning about reality, consciousness, and existence. The application uses information theory optimization and complex scoring algorithms to efficiently narrow down from 114 philosophical cosmologies to find the best matches.

## Development Commands

### Core Development
- `npm install` - Install dependencies
- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run generate` - Generate static files for deployment

### Technology Stack
- **Framework**: Nuxt 3 with Vue 3 Composition API
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS with custom cosmic theme
- **State Management**: Pinia stores + Nuxt useState composables
- **Deployment**: Vercel with static generation

## Architecture Overview

### Core Business Logic (Composables)
- **`useQuizEngine`** (`composables/useQuizEngine.ts`): Master quiz orchestrator that manages state, question selection, answer processing, and termination conditions
- **`useQuestionScoring`** (`composables/useQuestionScoring.ts`): Information theory-based question ranking using entropy, eliminations, conviction profiles, and bonuses
- **`useDataLoader`** (`composables/useDataLoader.ts`): Handles loading and validation of JSON data files

### Data Architecture
The quiz operates on static JSON files in `/public/data/`:
- `cosmology_features.json`: 114 cosmologies with relationship mappings (R=Required, NR=Not Required, DB=Deal Breaker, ''=Neutral)
- `question_library_v3.json`: Questions with concepts, polarities, and mutual exclusions
- `description_library.json`: Short cosmology descriptions
- `full_description_library.json`: Category descriptions

### Type System (`types/index.ts`)
Comprehensive TypeScript interfaces define the entire quiz system including:
- `Cosmology`, `Question`, `QuestionLibrary` for data structures
- `QuizState`, `ConvictionProfile` for runtime state
- `CONFIG` constants that mirror the original Python implementation
- Scoring types: `QuestionScore`, `QuestionBonuses`

### Component Structure
- **Quiz Flow**: `pages/index.vue` → `components/quiz/QuizInterface.vue` → `components/quiz/QuestionCard.vue`
- **Results**: `pages/results.vue` → `components/results/EnhancedResults.vue` with 4-section architecture
- **Shared**: `components/common/` for reusable UI elements

## Key Algorithms

### Question Selection Algorithm
The question scoring system (`useQuestionScoring.scoreQuestion`) combines:
1. **Base eliminations**: Product of YES/NO eliminations
2. **Information entropy**: Based on predicted answer probabilities
3. **Conviction bonuses**: Consistency, drill-down, novelty, and conviction penalties
4. **Uncertainty handling**: Special logic for users with high "don't know" rates

### Answer Processing
When processing answers (`useQuestionScoring.processAnswer`):
- **"Don't Know" answers**: Boost skeptical/agnostic cosmologies that embrace uncertainty
- **Definitive answers**: Apply standard scoring (R=+10, NR=+3, DB=eliminate)
- **Mutual exclusions**: Process concept rejections and cosmology eliminations

### State Management
Uses Nuxt's `useState` for global state persistence:
- Quiz state survives navigation and includes full history for back functionality
- Conviction profiles track user's conceptual commitments
- Elimination tracking with snapshot/restore capability

## Development Patterns

### Composables Pattern
All business logic is encapsulated in composables that return reactive refs and methods. This enables clean separation between UI and logic while maintaining reactivity.

### Configuration-Driven
The `CONFIG` object in `types/index.ts` contains all scoring parameters, thresholds, and behavioral constants that can be tuned without changing algorithm logic.

### Information Theory Integration
The system uses entropy calculations and probability estimation to intelligently select the most informative questions, making the quiz both efficient and adaptive to user responses.

## Data Flow

1. **Initialization**: `useDataLoader.loadAllData()` loads all JSON files
2. **Question Selection**: `useQuizEngine.findNextQuestion()` uses scoring algorithm to pick optimal question
3. **Answer Processing**: User answers trigger score updates, conviction tracking, and elimination logic
4. **Termination**: Quiz ends when one cosmology remains, diminishing returns detected, or question limit reached
5. **Results**: Enhanced display shows top matches with bidirectional conviction visualization

## Deployment

The application is optimized for Vercel deployment with static generation. The `vercel.json` configures caching headers for data files, and the build process creates a fully static site.