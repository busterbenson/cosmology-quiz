# Cosmology Quiz - Vue/Nuxt Web Application

A sophisticated web application that helps users discover their philosophical worldview through intelligent questioning about reality, consciousness, and existence.

## Features

- **Intelligent Questioning**: Uses information theory optimization to select the most informative questions
- **Advanced Scoring**: Complex scoring system with mutual exclusions and conceptual conviction tracking
- **Enhanced Results**: 4-section results display with bidirectional visualization and philosophical spectrum analysis
- **Responsive Design**: Modern, mobile-friendly interface with smooth animations
- **114 Cosmologies**: Comprehensive database of philosophical worldviews from around the world
- **Real-time Progress**: Dynamic progress tracking with elimination visualization

## Technology Stack

- **Framework**: Nuxt 3 with Vue 3 Composition API
- **Styling**: Tailwind CSS with custom cosmic theme
- **Language**: TypeScript for full type safety
- **State Management**: Pinia for complex quiz state
- **Deployment**: Vercel with Edge Functions
- **Data**: Static JSON files (no database required)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cosmologies
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
npm run generate
```

Then deploy the `dist` folder to Vercel or any static hosting service.

## Project Structure

```
cosmologies/
├── components/
│   ├── quiz/              # Quiz interface components
│   ├── results/           # Enhanced results display
│   └── common/            # Shared components
├── composables/           # Business logic and state management
├── pages/                 # Route components
├── public/data/           # Quiz data (JSON files)
├── types/                 # TypeScript interfaces
└── assets/css/            # Styles and themes
```

## Key Components

- **useQuizEngine**: Core quiz logic with information theory optimization
- **useQuestionScoring**: Advanced question selection and scoring algorithms
- **EnhancedResults**: Comprehensive results display with 4-section architecture
- **BiDirectionalDots**: Visual representation of conviction strengths

## Data Files

- `cosmology_features.json`: 114 cosmologies with feature mappings
- `question_library_v3.json`: Questions with concepts and mutual exclusions
- `description_library.json`: Short descriptions for each cosmology
- `full_description_library.json`: Detailed category descriptions

## Configuration

The app uses a configuration system that mirrors the original Python implementation:

- Scoring constants and thresholds
- Information theory parameters
- User experience settings
- Visual display options

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Based on the original Python cosmology quiz system
- Enhanced with modern web technologies and UX principles
- Information theory optimization for intelligent question selection