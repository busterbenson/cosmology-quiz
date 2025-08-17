#!/usr/bin/env python3
"""
Debug Analytical Idealism Quiz Discrepancy

This script analyzes why the actual quiz diverged from the simulation
for the Analytical Idealism path.
"""

import json
from typing import List, Dict, Tuple
from collections import defaultdict

def analyze_analytical_idealism_discrepancy():
    """Analyze the specific discrepancy for Analytical Idealism path."""
    
    print("🔍 ANALYTICAL IDEALISM QUIZ DISCREPANCY ANALYSIS")
    print("=" * 60)
    
    # Load simulation data
    with open('all_realistic_optimal_paths.json', 'r') as f:
        paths = json.load(f)
    
    # Load question library to understand relationships
    with open('public/data/question_library_v3.json', 'r') as f:
        questions = json.load(f)
    
    # Load cosmology features
    with open('public/data/cosmology_features.json', 'r') as f:
        cosmologies = json.load(f)
    
    # Get Analytical Idealism simulation data
    ai_path = paths['Analytical Idealism']
    
    print(f"📊 SIMULATION DATA FOR ANALYTICAL IDEALISM")
    print(f"Strategy used: {ai_path['strategy_used']}")
    print(f"Total questions: {ai_path['total_questions']}")
    print(f"Final score: {ai_path['best_score']}")
    print(f"Final rank: #{ai_path['best_rank']}")
    print()
    
    # Show first 5 questions from simulation
    print("🎯 SIMULATED QUESTION SEQUENCE:")
    for i, (question, answer) in enumerate(zip(ai_path['questions_asked'][:5], ai_path['answers_given'][:5])):
        print(f"{i+1:2d}. {question}")
        print(f"    Answer: {answer}")
        print()
    
    # Analyze why question 4 might be different
    print("🧠 ANALYSIS OF QUESTION 4 DIVERGENCE")
    print("-" * 40)
    
    # Get the two competing questions
    q4_sim = "Practical results over theory"
    q4_actual = "Consciousness fundamental to reality"
    
    print(f"Simulation question 4: {q4_sim}")
    print(f"Actual quiz question 4: {q4_actual}")
    print()
    
    # Find Analytical Idealism's relationship to these questions
    ai_cosmology = None
    for cosmo in cosmologies:
        if cosmo['Cosmology'] == 'Analytical Idealism':
            ai_cosmology = cosmo
            break
    
    if ai_cosmology:
        rel_sim = ai_cosmology.get(q4_sim, 'NR')
        rel_actual = ai_cosmology.get(q4_actual, 'NR')
        
        print(f"Analytical Idealism's relationship to '{q4_sim}': {rel_sim}")
        print(f"Analytical Idealism's relationship to '{q4_actual}': {rel_actual}")
        print()
        
        # Analyze which would be better for Analytical Idealism
        if rel_actual == 'R':
            print(f"✅ '{q4_actual}' is REQUIRED for Analytical Idealism")
        elif rel_actual == 'DB':
            print(f"❌ '{q4_actual}' is a DEAL BREAKER for Analytical Idealism")
        else:
            print(f"⚪ '{q4_actual}' is NOT REQUIRED for Analytical Idealism")
        
        if rel_sim == 'R':
            print(f"✅ '{q4_sim}' is REQUIRED for Analytical Idealism")
        elif rel_sim == 'DB':
            print(f"❌ '{q4_sim}' is a DEAL BREAKER for Analytical Idealism")
        else:
            print(f"⚪ '{q4_sim}' is NOT REQUIRED for Analytical Idealism")
        print()
    
    # Analyze conviction profile after first 3 questions
    print("🎯 CONVICTION PROFILE ANALYSIS AFTER 3 QUESTIONS")
    print("-" * 50)
    
    conviction_profile = defaultdict(lambda: {"pro": 0, "con": 0})
    
    # Simulate first 3 answers
    first_3_questions = ai_path['questions_asked'][:3]
    first_3_answers = ai_path['answers_given'][:3]
    
    for question_key, answer in zip(first_3_questions, first_3_answers):
        if question_key in questions and answer != '?':
            question_data = questions[question_key]
            for concept in question_data.get('concepts', []):
                tag = concept['tag']
                polarity = concept['polarity']
                
                if tag not in conviction_profile:
                    conviction_profile[tag] = {"pro": 0, "con": 0}
                
                if (answer == 'Y' and polarity == 'pro') or (answer == 'N' and polarity == 'con'):
                    conviction_profile[tag]["pro"] += 1
                elif (answer == 'Y' and polarity == 'con') or (answer == 'N' and polarity == 'pro'):
                    conviction_profile[tag]["con"] += 1
    
    print("Conviction profile after 3 questions:")
    for tag, profile in sorted(conviction_profile.items()):
        if profile["pro"] > 0 or profile["con"] > 0:
            print(f"  {tag}: pro={profile['pro']}, con={profile['con']}")
    print()
    
    # Analyze question concepts for the competing questions
    if q4_sim in questions and q4_actual in questions:
        print("🔍 QUESTION CONCEPT ANALYSIS")
        print("-" * 30)
        
        sim_concepts = questions[q4_sim].get('concepts', [])
        actual_concepts = questions[q4_actual].get('concepts', [])
        
        print(f"'{q4_sim}' concepts:")
        for concept in sim_concepts:
            tag = concept['tag']
            polarity = concept['polarity']
            profile_data = conviction_profile.get(tag, {"pro": 0, "con": 0})
            print(f"  - {tag} ({polarity}): user profile pro={profile_data['pro']}, con={profile_data['con']}")
        print()
        
        print(f"'{q4_actual}' concepts:")
        for concept in actual_concepts:
            tag = concept['tag']
            polarity = concept['polarity']
            profile_data = conviction_profile.get(tag, {"pro": 0, "con": 0})
            print(f"  - {tag} ({polarity}): user profile pro={profile_data['pro']}, con={profile_data['con']}")
        print()
    
    # Potential explanations
    print("🤔 POTENTIAL EXPLANATIONS FOR DIVERGENCE")
    print("-" * 45)
    print("1. Browser state differences: Session storage, cache, or timing")
    print("2. Question scoring differences: Subtle algorithm variations")
    print("3. Floating point precision: Different calculation results")
    print("4. Random seed differences: If any randomization is involved")
    print("5. User profile tracking: Additional factors not in simulation")
    print("6. Question pool state: Different available questions")
    print("7. Conviction profile calculation: Subtle differences in tracking")
    print()
    
    print("🛠️ RECOMMENDED DEBUGGING STEPS")
    print("-" * 35)
    print("1. Add console logging to actual quiz engine for question scoring")
    print("2. Compare conviction profile state after each question")
    print("3. Log question scoring calculations in real-time")
    print("4. Check if browser environment affects scoring")
    print("5. Verify question pool filtering logic")

if __name__ == "__main__":
    analyze_analytical_idealism_discrepancy()