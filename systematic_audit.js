#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load cosmology data
const cosmologyData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/cosmology_features.json'), 'utf8')
);

// Validation criteria
const VALIDATION_CRITERIA = {
  MINIMUM_ASSIGNMENTS: 10,
  TARGET_ASSIGNMENTS: 20,
  IDEAL_ASSIGNMENTS: 30,
  MAX_DENSITY: 80, // Prevent over-specification
  
  // Category-specific requirements
  CATEGORY_REQUIREMENTS: {
    'Agnostic Spiritual Seeker': {
      minR: 3,
      maxDB: 5,
      mustHave: ['Comfortable with uncertainty', 'Openness to multiple alternative explanations']
    },
    'Unconventional Skeptic': {
      minR: 3,
      maxDB: 15,
      mustHave: ['Comfortable with uncertainty', 'Metaphysical certainty rejected']
    },
    'Consciousness-First': {
      minR: 5,
      minDB: 3,
      mustHave: ['Consciousness fundamental to reality']
    },
    'Scientific': {
      minR: 5,
      minDB: 5,
      mustHave: ['Physical matter/energy as fundamental']
    }
  }
};

function analyzeCosmology(cosmology) {
  const beliefs = Object.entries(cosmology).filter(([key, value]) => 
    !['Order', 'Category', 'Cosmology'].includes(key)
  );
  
  const required = beliefs.filter(([key, value]) => value === 'R');
  const opposed = beliefs.filter(([key, value]) => value === 'DB');
  const notRelated = beliefs.filter(([key, value]) => value === 'NR');
  const empty = beliefs.filter(([key, value]) => value === '');
  
  const total = required.length + opposed.length;
  const density = (total / beliefs.length * 100);
  
  return {
    cosmology: cosmology.Cosmology,
    category: cosmology.Category,
    required: required.map(([k, v]) => k),
    opposed: opposed.map(([k, v]) => k),
    notRelated: notRelated.map(([k, v]) => k),
    empty: empty.map(([k, v]) => k),
    stats: {
      requiredCount: required.length,
      opposedCount: opposed.length,
      notRelatedCount: notRelated.length,
      emptyCount: empty.length,
      total,
      density
    }
  };
}

function validateCosmology(analysis) {
  const issues = [];
  const recommendations = [];
  const { cosmology, category, stats } = analysis;
  
  // Check minimum assignments
  if (stats.total < VALIDATION_CRITERIA.MINIMUM_ASSIGNMENTS) {
    issues.push(`Critical: Only ${stats.total} total assignments (minimum: ${VALIDATION_CRITERIA.MINIMUM_ASSIGNMENTS})`);
  }
  
  // Check category-specific requirements
  const categoryReq = VALIDATION_CRITERIA.CATEGORY_REQUIREMENTS[category];
  if (categoryReq) {
    if (categoryReq.minR && stats.requiredCount < categoryReq.minR) {
      issues.push(`Category requirement: Needs at least ${categoryReq.minR} required beliefs (has ${stats.requiredCount})`);
    }
    
    if (categoryReq.maxDB && stats.opposedCount > categoryReq.maxDB) {
      issues.push(`Category issue: Too many opposed beliefs ${stats.opposedCount} (max recommended: ${categoryReq.maxDB})`);
    }
    
    if (categoryReq.mustHave) {
      const missing = categoryReq.mustHave.filter(belief => !analysis.required.includes(belief));
      if (missing.length > 0) {
        issues.push(`Missing core beliefs for ${category}: ${missing.join(', ')}`);
      }
    }
  }
  
  // Check for over-specification
  if (stats.density > VALIDATION_CRITERIA.MAX_DENSITY) {
    issues.push(`Over-specified: ${stats.density.toFixed(1)}% density (recommend <${VALIDATION_CRITERIA.MAX_DENSITY}%)`);
  }
  
  // Generate recommendations
  if (stats.total < VALIDATION_CRITERIA.TARGET_ASSIGNMENTS) {
    const needed = VALIDATION_CRITERIA.TARGET_ASSIGNMENTS - stats.total;
    recommendations.push(`Add ${needed} more R/DB assignments to reach target of ${VALIDATION_CRITERIA.TARGET_ASSIGNMENTS}`);
  }
  
  if (stats.emptyCount > 0) {
    recommendations.push(`Fill ${stats.emptyCount} empty fields`);
  }
  
  // Check for logical inconsistencies based on category
  if (category.includes('Skeptic') || category.includes('Agnostic')) {
    const problematicBeliefs = analysis.required.filter(belief => 
      belief.includes('True self is identical') || 
      belief.includes('ultimate reality') ||
      (belief.includes('God') && !belief.includes('uncertainty'))
    );
    if (problematicBeliefs.length > 0) {
      issues.push(`Logical inconsistency: Skeptic/agnostic claiming certainty about: ${problematicBeliefs.join(', ')}`);
    }
  }
  
  return {
    priority: determinePriority(stats, issues),
    issues,
    recommendations,
    needsWork: issues.length > 0 || stats.total < VALIDATION_CRITERIA.TARGET_ASSIGNMENTS
  };
}

function determinePriority(stats, issues) {
  if (stats.total <= 5) return 'Critical';
  if (stats.total <= 10) return 'High';
  if (stats.total <= 15) return 'Medium';
  if (issues.length > 0) return 'Low';
  return 'Maintenance';
}

function generateAuditReport() {
  console.log('=== SYSTEMATIC COSMOLOGY AUDIT REPORT ===\\n');
  
  const analyses = cosmologyData.map(analyzeCosmology);
  const validations = analyses.map(analysis => ({
    ...analysis,
    validation: validateCosmology(analysis)
  }));
  
  // Group by priority
  const priorities = {
    Critical: [],
    High: [],
    Medium: [],
    Low: [],
    Maintenance: []
  };
  
  validations.forEach(item => {
    priorities[item.validation.priority].push(item);
  });
  
  // Print summary
  console.log('PRIORITY SUMMARY:');
  Object.entries(priorities).forEach(([priority, items]) => {
    console.log(`  ${priority}: ${items.length} cosmologies`);
  });
  console.log();
  
  // Print detailed issues for each priority
  Object.entries(priorities).forEach(([priority, items]) => {
    if (items.length === 0) return;
    
    console.log(`=== ${priority.toUpperCase()} PRIORITY ===`);
    items.forEach(item => {
      if (item.validation.needsWork) {
        console.log(`\\n${item.cosmology} (${item.category}):`);
        console.log(`  Stats: R=${item.stats.requiredCount}, DB=${item.stats.opposedCount}, Total=${item.stats.total}, Density=${item.stats.density.toFixed(1)}%`);
        
        if (item.validation.issues.length > 0) {
          console.log('  Issues:');
          item.validation.issues.forEach(issue => console.log(`    - ${issue}`));
        }
        
        if (item.validation.recommendations.length > 0) {
          console.log('  Recommendations:');
          item.validation.recommendations.forEach(rec => console.log(`    + ${rec}`));
        }
      }
    });
    console.log();
  });
  
  return validations;
}

function generateWorkPlan(validations) {
  const workItems = validations
    .filter(item => item.validation.needsWork)
    .sort((a, b) => {
      const priorityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3, Maintenance: 4 };
      return priorityOrder[a.validation.priority] - priorityOrder[b.validation.priority];
    });
  
  console.log('=== SYSTEMATIC WORK PLAN ===\\n');
  
  workItems.forEach((item, index) => {
    console.log(`${index + 1}. ${item.cosmology} [${item.validation.priority}]`);
    console.log(`   Category: ${item.category}`);
    console.log(`   Current: R=${item.stats.requiredCount}, DB=${item.stats.opposedCount}, Total=${item.stats.total}`);
    
    if (item.validation.issues.length > 0) {
      console.log(`   Issues: ${item.validation.issues.join('; ')}`);
    }
    
    console.log();
  });
  
  console.log(`Total cosmologies needing work: ${workItems.length}`);
  console.log(`Estimated effort: ${workItems.length * 15} minutes (15 min per cosmology)`);
  
  return workItems;
}

function auditSpecificCosmology(cosmologyName) {
  const cosmology = cosmologyData.find(c => c.Cosmology === cosmologyName);
  if (!cosmology) {
    console.log(`Cosmology "${cosmologyName}" not found.`);
    return;
  }
  
  const analysis = analyzeCosmology(cosmology);
  const validation = validateCosmology(analysis);
  
  console.log(`=== DETAILED AUDIT: ${cosmologyName} ===\\n`);
  console.log(`Category: ${analysis.category}`);
  console.log(`Priority: ${validation.priority}`);
  console.log(`Stats: R=${analysis.stats.requiredCount}, DB=${analysis.stats.opposedCount}, Total=${analysis.stats.total}, Density=${analysis.stats.density.toFixed(1)}%\\n`);
  
  if (validation.issues.length > 0) {
    console.log('ISSUES:');
    validation.issues.forEach(issue => console.log(`  ❌ ${issue}`));
    console.log();
  }
  
  if (validation.recommendations.length > 0) {
    console.log('RECOMMENDATIONS:');
    validation.recommendations.forEach(rec => console.log(`  💡 ${rec}`));
    console.log();
  }
  
  console.log('REQUIRED BELIEFS:');
  analysis.required.forEach(belief => console.log(`  ✓ ${belief}`));
  
  console.log('\\nOPPOSED BELIEFS:');
  analysis.opposed.forEach(belief => console.log(`  ✗ ${belief}`));
  
  if (analysis.empty.length > 0) {
    console.log('\\nEMPTY FIELDS:');
    analysis.empty.forEach(field => console.log(`  ⚠ ${field}`));
  }
  
  return { analysis, validation };
}

// Command line interface
const args = process.argv.slice(2);

if (args.length === 0) {
  const validations = generateAuditReport();
  generateWorkPlan(validations);
} else if (args[0] === 'audit' && args[1]) {
  auditSpecificCosmology(args[1]);
} else if (args[0] === 'plan') {
  const validations = cosmologyData.map(analyzeCosmology).map(analysis => ({
    ...analysis,
    validation: validateCosmology(analysis)
  }));
  generateWorkPlan(validations);
} else {
  console.log('Usage:');
  console.log('  node systematic_audit.js                    # Full audit report');
  console.log('  node systematic_audit.js audit "Name"       # Audit specific cosmology'); 
  console.log('  node systematic_audit.js plan              # Generate work plan only');
}

module.exports = { analyzeCosmology, validateCosmology, auditSpecificCosmology };