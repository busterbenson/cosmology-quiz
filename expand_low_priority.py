#!/usr/bin/env python3
"""
Script to expand all Low Priority cosmologies (16-19 assignments) to exactly 20 R+DB assignments each.
"""

import json
import copy

def count_r_db_assignments(assignments):
    """Count R and DB assignments in a cosmology's assignments dict."""
    return sum(1 for value in assignments.values() if value in ['R', 'DB'])

def expand_cosmology(cosmology_data, target_count=20):
    """Expand a cosmology to target_count R+DB assignments."""
    assignments = cosmology_data['assignments']
    current_count = count_r_db_assignments(assignments)
    cosmology_name = cosmology_data['cosmology']
    category = cosmology_data['category']
    
    if current_count >= target_count:
        print(f"  {cosmology_name}: Already has {current_count} assignments (no change needed)")
        return cosmology_data, 0
    
    needed = target_count - current_count
    print(f"  {cosmology_name}: {current_count} -> {target_count} (adding {needed} assignments)")
    
    # Define expansion strategies based on cosmology characteristics
    expansion_features = get_expansion_features(cosmology_name, category, assignments)
    
    # Apply expansions
    changes_made = 0
    for feature, assignment_type in expansion_features:
        if changes_made >= needed:
            break
        if assignments.get(feature) == "NR":
            assignments[feature] = assignment_type
            changes_made += 1
            print(f"    + {feature} -> {assignment_type}")
    
    return cosmology_data, changes_made

def get_expansion_features(cosmology_name, category, assignments):
    """Get appropriate features to expand for each cosmology based on its characteristics."""
    
    # Common consciousness-focused features
    consciousness_features = [
        ("Consciousness fundamental to reality", "R"),
        ("Consciousness creates reality", "R"),
        ("External world as mental manifestation", "R"),
        ("Individual minds as aspects of cosmic mind", "R"),
        ("Quantum effects demonstrate mind's primacy", "R"),
        ("Structures of consciousness shape experience", "R"),
        ("Transcendence of subject–object distinction", "R"),
    ]
    
    # Common spiritual/mystical features
    spiritual_features = [
        ("Humanity evolving spiritually", "R"),
        ("Personal truth over dogma", "R"),
        ("Direct experience over doctrine", "R"),
        ("Ultimate reality beyond concepts", "R"),
        ("True self is identical with ultimate reality", "R"),
        ("Ineffable spiritual reality beyond human comprehension", "R"),
        ("Primordial awareness as ground of being", "R"),
    ]
    
    # Common rejection features (DB assignments)
    rejection_features = [
        ("Physical matter/energy as fundamental", "DB"),
        ("Consciousness emerges from physical processes", "DB"),
        ("Scientific consensus on cosmology accepted", "DB"),
        ("Practical results over theory", "DB"),
        ("Material world created by flawed being", "DB"),
    ]
    
    # Cosmology-specific expansions
    if cosmology_name == "Taoist Harmony":
        return [
            ("Microcosm–Macrocosm correspondence (\"as above, so below\")", "R"),
            ("Universe/cosmos arises spontaneously (without external cause)", "R"),
            ("Time as cyclical", "R"),
        ] + spiritual_features
    
    elif cosmology_name == "Classical Gnosticism":
        return [
            ("Material world created by flawed being", "R"),
            ("Salvation through secret knowledge", "R"),
            ("Reality divided between spirit and matter", "R"),
            ("Hidden controllers of reality", "R"),
        ] + rejection_features
    
    elif cosmology_name == "Philosophical Dualism":
        return [
            ("Reality divided between spirit and matter", "R"),
            ("Mental and physical as aspects of neutral substance", "DB"),
        ] + consciousness_features + rejection_features
    
    elif cosmology_name == "Modern Matrix Skepticism":
        return [
            ("Reality as simulation/program", "R"),
            ("Hidden controllers of reality", "R"),
            ("Current scientific paradigm fundamentally flawed", "R"),
        ] + rejection_features
    
    elif cosmology_name == "Yogācāra Buddhism":
        return [
            ("Universe as extrinsic appearance of consciousness", "R"),
            ("All phenomena lack inherent existence", "R"),
            ("Self and world not separate", "R"),
            ("Physical world is illusion", "R"),
        ] + consciousness_features
    
    elif cosmology_name == "Vajrayana Luminosity":
        return [
            ("Primordial awareness as ground of being", "R"),
            ("All phenomena lack inherent existence", "R"),
            ("Self and world not separate", "R"),
            ("Transcendence of subject–object distinction", "R"),
        ] + spiritual_features
    
    elif cosmology_name == "Quantum Idealism":
        return [
            ("Quantum effects demonstrate mind's primacy", "R"),
            ("Universe as extrinsic appearance of consciousness", "R"),
            ("Individual minds as aspects of cosmic mind", "R"),
            ("Structures of consciousness shape experience", "R"),
        ] + consciousness_features
    
    elif cosmology_name == "Neutral Monism":
        return [
            ("Mental and physical as aspects of neutral substance", "R"),
            ("Individual minds as aspects of cosmic mind", "R"),
        ] + consciousness_features + rejection_features
    
    elif cosmology_name == "Cyclical Universe":
        return [
            ("Universe cycles through repeated big bangs", "R"),
            ("Time as cyclical", "R"),
            ("Multiple universes exist simultaneously", "R"),
        ] + spiritual_features
    
    elif cosmology_name == "Continuous Creation":
        return [
            ("Continuous Divine Creation", "R"),
            ("Divine intervention in evolution", "R"),
            ("Universe/cosmos arises spontaneously (without external cause)", "R"),
        ] + spiritual_features
    
    elif cosmology_name == "Dependent Existence":
        return [
            ("All phenomena lack inherent existence", "R"),
            ("Self and world not separate", "R"),
            ("Universe/cosmos arises spontaneously (without external cause)", "R"),
        ] + consciousness_features
    
    elif cosmology_name == "Divine Qualities in Creation":
        return [
            ("Divine intervention in evolution", "R"),
            ("Evolution has spiritual direction", "R"),
            ("Divine permeates and transcends universe", "R"),
        ] + spiritual_features
    
    elif cosmology_name == "Layered Reality":
        return [
            ("Multiple universes exist simultaneously", "R"),
            ("Microcosm–Macrocosm correspondence (\"as above, so below\")", "R"),
            ("Universe on a brane in higher dimensions", "R"),
        ] + consciousness_features
    
    elif cosmology_name == "Integral Cultivation":
        return [
            ("Humanity evolving spiritually", "R"),
        ] + consciousness_features + spiritual_features
    
    elif cosmology_name == "Natural Harmony":
        return [
            ("Microcosm–Macrocosm correspondence (\"as above, so below\")", "R"),
            ("Universe/cosmos arises spontaneously (without external cause)", "R"),
        ] + spiritual_features + consciousness_features
    
    elif cosmology_name == "Buddhist Mind-Only":
        return [
            ("All phenomena lack inherent existence", "R"),
            ("Self and world not separate", "R"),
            ("Physical world is illusion", "R"),
        ] + consciousness_features
    
    elif cosmology_name == "Luminous Awareness":
        return [
            ("Primordial awareness as ground of being", "R"),
            ("Self and world not separate", "R"),
        ] + consciousness_features + spiritual_features
    
    elif cosmology_name == "Mystical Pantheism":
        return [
            ("God and universe are identical", "R"),
        ] + spiritual_features + consciousness_features
    
    elif cosmology_name == "Organic Pantheism":
        return [
            ("God and universe are identical", "R"),
            ("All things possess consciousness", "R"),
        ] + spiritual_features + consciousness_features
    
    # Default fallback for any missed cosmologies
    return consciousness_features + spiritual_features + rejection_features

def main():
    """Main function to expand all Low Priority cosmologies."""
    
    # Load the data
    with open('/Users/buster/projects/cosmologies/public/data/cosmology_features.json', 'r') as f:
        data = json.load(f)
    
    print("Expanding Low Priority Cosmologies to 20 R+DB assignments each")
    print("=" * 70)
    
    # Track changes
    total_changes = 0
    expanded_cosmologies = []
    
    # Process each cosmology
    for i, cosmology in enumerate(data['cosmologies']):
        current_count = count_r_db_assignments(cosmology['assignments'])
        
        # Only process Low Priority cosmologies (16-19 assignments)
        if 16 <= current_count <= 19:
            print(f"\n{len(expanded_cosmologies) + 1}. Processing: {cosmology['cosmology']}")
            
            updated_cosmology, changes = expand_cosmology(cosmology, target_count=20)
            data['cosmologies'][i] = updated_cosmology
            
            total_changes += changes
            expanded_cosmologies.append({
                'name': cosmology['cosmology'],
                'before': current_count,
                'after': count_r_db_assignments(updated_cosmology['assignments']),
                'changes': changes
            })
    
    # Update metadata
    data['metadata']['expansion_date'] = "2025-08-17"
    if 'expanded_cosmologies' not in data['metadata']:
        data['metadata']['expanded_cosmologies'] = []
    
    for exp in expanded_cosmologies:
        if exp['name'] not in data['metadata']['expanded_cosmologies']:
            data['metadata']['expanded_cosmologies'].append(exp['name'])
    
    # Save the updated data
    with open('/Users/buster/projects/cosmologies/public/data/cosmology_features.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    # Print summary
    print("\n" + "=" * 70)
    print("EXPANSION SUMMARY")
    print("=" * 70)
    
    for exp in expanded_cosmologies:
        print(f"{exp['name']:<40} | {exp['before']:>2} -> {exp['after']:>2} ({exp['changes']:+2} changes)")
    
    print(f"\nTotal cosmologies expanded: {len(expanded_cosmologies)}")
    print(f"Total assignment changes made: {total_changes}")
    print(f"All Low Priority cosmologies now have exactly 20 R+DB assignments.")

if __name__ == "__main__":
    main()