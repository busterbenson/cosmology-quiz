#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load cosmology data
const cosmologyData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/cosmology_features.json'), 'utf8')
);

function analyzeCosmologyProfiles() {
  const profiles = cosmologyData.map(cosmology => {
    const beliefs = Object.entries(cosmology).filter(([key, value]) => 
      !['Order', 'Category', 'Cosmology'].includes(key)
    );
    
    const required = beliefs.filter(([key, value]) => value === 'R').length;
    const opposed = beliefs.filter(([key, value]) => value === 'DB').length;
    const notRelated = beliefs.filter(([key, value]) => value === 'NR').length;
    const empty = beliefs.filter(([key, value]) => value === '').length;
    const total = required + opposed;
    const density = (total / beliefs.length * 100).toFixed(1);
    
    return {
      name: cosmology.Cosmology,
      category: cosmology.Category,
      order: cosmology.Order,
      required,
      opposed,
      notRelated,
      empty,
      total,
      density: parseFloat(density),
      beliefs: Object.fromEntries(beliefs)
    };
  });
  
  return profiles.sort((a, b) => a.total - b.total);
}

function categorizeByPriority(profiles) {
  const priority1 = profiles.filter(p => p.total <= 5);
  const priority2 = profiles.filter(p => p.total >= 6 && p.total <= 10);
  const priority3 = profiles.filter(p => p.total >= 11 && p.total <= 15);
  const priority4 = profiles.filter(p => p.total >= 16 && p.total <= 25);
  const wellSpecified = profiles.filter(p => p.total > 25);
  
  return { priority1, priority2, priority3, priority4, wellSpecified };
}

function generateReport() {
  const profiles = analyzeCosmologyProfiles();
  const categories = categorizeByPriority(profiles);
  const avgDensity = profiles.reduce((sum, p) => sum + p.density, 0) / profiles.length;
  
  console.log('=== COSMOLOGY PROFILE AUDIT REPORT ===\\n');
  
  console.log(`Total cosmologies: ${profiles.length}`);
  console.log(`Average density: ${avgDensity.toFixed(1)}%\\n`);
  
  console.log('PRIORITY 1 - CRITICAL (≤5 total R+DB):');
  categories.priority1.forEach(p => {
    console.log(`  ${p.name} (${p.category}): R=${p.required}, DB=${p.opposed}, Total=${p.total}`);
  });
  
  console.log(`\\nPRIORITY 2 - UNDER-SPECIFIED (6-10 total R+DB):`);
  categories.priority2.forEach(p => {
    console.log(`  ${p.name} (${p.category}): R=${p.required}, DB=${p.opposed}, Total=${p.total}`);
  });
  
  console.log(`\\nPRIORITY 3 - SPARSE (11-15 total R+DB):`);
  categories.priority3.forEach(p => {
    console.log(`  ${p.name} (${p.category}): R=${p.required}, DB=${p.opposed}, Total=${p.total}`);
  });
  
  console.log(`\\nSUMMARY:`);
  console.log(`  Priority 1 (Critical): ${categories.priority1.length} cosmologies`);
  console.log(`  Priority 2 (Under-specified): ${categories.priority2.length} cosmologies`);
  console.log(`  Priority 3 (Sparse): ${categories.priority3.length} cosmologies`);
  console.log(`  Priority 4 (Review needed): ${categories.priority4.length} cosmologies`);
  console.log(`  Well-specified: ${categories.wellSpecified.length} cosmologies`);
  
  // Find cosmologies that need immediate attention
  const needsWork = [...categories.priority1, ...categories.priority2];
  console.log(`\\nCOSMOLOGIES NEEDING IMMEDIATE WORK: ${needsWork.length}`);
  
  return { profiles, categories };
}

function analyzeSpecificCosmology(cosmologyName) {
  const cosmology = cosmologyData.find(c => c.Cosmology === cosmologyName);
  if (!cosmology) {
    console.log(`Cosmology "${cosmologyName}" not found.`);
    return;
  }
  
  const beliefs = Object.entries(cosmology).filter(([key, value]) => 
    !['Order', 'Category', 'Cosmology'].includes(key)
  );
  
  const required = beliefs.filter(([key, value]) => value === 'R');
  const opposed = beliefs.filter(([key, value]) => value === 'DB');
  const notRelated = beliefs.filter(([key, value]) => value === 'NR');
  const empty = beliefs.filter(([key, value]) => value === '');
  
  console.log(`=== ANALYSIS: ${cosmologyName} ===\\n`);
  console.log(`Category: ${cosmology.Category}`);
  console.log(`Order: ${cosmology.Order}\\n`);
  
  console.log(`REQUIRED BELIEFS (${required.length}):`);
  required.forEach(([key, value]) => console.log(`  ✓ ${key}`));
  
  console.log(`\\nOPPOSED BELIEFS (${opposed.length}):`);
  opposed.forEach(([key, value]) => console.log(`  ✗ ${key}`));
  
  console.log(`\\nNOT RELATED (${notRelated.length}):`);
  if (notRelated.length <= 10) {
    notRelated.forEach(([key, value]) => console.log(`  ? ${key}`));
  } else {
    notRelated.slice(0, 10).forEach(([key, value]) => console.log(`  ? ${key}`));
    console.log(`  ... and ${notRelated.length - 10} more`);
  }
  
  if (empty.length > 0) {
    console.log(`\\nEMPTY FIELDS (${empty.length}):`);
    empty.forEach(([key, value]) => console.log(`  ⚠ ${key}`));
  }
  
  const total = required.length + opposed.length;
  const density = (total / beliefs.length * 100).toFixed(1);
  console.log(`\\nSUMMARY: ${total} total assignments (${density}% density)`);
  
  return { cosmology, required, opposed, notRelated, empty };
}

// Command line interface
const args = process.argv.slice(2);
if (args.length === 0) {
  generateReport();
} else if (args[0] === 'analyze' && args[1]) {
  analyzeSpecificCosmology(args[1]);
} else {
  console.log('Usage:');
  console.log('  node audit_cosmologies.js                    # Generate full report');
  console.log('  node audit_cosmologies.js analyze "Name"     # Analyze specific cosmology');
}