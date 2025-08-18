// Test if differentiation scaling fix allows AI Required questions to be selected
const analyticalIdealismAnswers = {
  "Aliens intervened in human evolution": "N",
  "Biblical stories are literally true": "N", 
  "Consciousness emerges from brain activity": "N",
  "Death is complete cessation": "N",
  "Divine beings intervene in daily life": "N",
  "Evolution is entirely random": "N",
  "Free will is an illusion": "N",
  "Gender roles are divinely ordained": "N",
  "Higher beings guide human evolution": "Y",
  "Human behavior is primarily biological": "N",
  "Humans are naturally competitive": "N",
  "Individual minds as aspects of cosmic mind": "Y", // Required for AI
  "External world as mental manifestation": "Y", // Required for AI  
  "Structures of consciousness shape experience": "Y", // Required for AI
}

console.log('Testing Analytical Idealism with differentiation scaling fix...')
console.log('Required questions that should be selected:')
console.log('- Individual minds as aspects of cosmic mind')
console.log('- External world as mental manifestation') 
console.log('- Structures of consciousness shape experience')
console.log('')
console.log('Answer profile prepared with', Object.keys(analyticalIdealismAnswers).length, 'answers')