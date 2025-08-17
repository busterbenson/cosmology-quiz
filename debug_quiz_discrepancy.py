#!/usr/bin/env python3
"""
Debug Quiz Discrepancy Tool

This script helps identify why a real quiz session differs from the simulation.
"""

import json
from typing import List, Tuple

def analyze_partial_path(questions_asked: List[str], answers_given: List[str], 
                        final_top_5: List[Tuple[str, float]]) -> None:
    """Analyze a partial real quiz path vs simulation."""
    
    print("🔍 QUIZ DISCREPANCY ANALYSIS")
    print("=" * 50)
    
    # Load simulation data
    with open('all_realistic_optimal_paths.json', 'r') as f:
        simulated_paths = json.load(f)
    
    # Check if Analytical Idealism path matches the user's first N questions
    if 'Analytical Idealism' in simulated_paths:
        sim_path = simulated_paths['Analytical Idealism']
        sim_questions = sim_path['questions_asked']
        sim_answers = sim_path['answers_given']
        
        print(f"Simulated Analytical Idealism path: {len(sim_questions)} questions")
        print(f"Your actual path: {len(questions_asked)} questions")
        print()
        
        # Compare question by question
        matches = 0
        for i in range(min(len(questions_asked), len(sim_questions))):
            q_match = questions_asked[i] == sim_questions[i]
            a_match = answers_given[i] == sim_answers[i]
            status = "✅" if q_match and a_match else "❌"
            
            print(f"{i+1:2d}. {status} Q: {questions_asked[i]}")
            if not q_match:
                print(f"    Expected: {sim_questions[i]}")
            print(f"    Your answer: {answers_given[i]} | Sim answer: {sim_answers[i]}")
            
            if q_match and a_match:
                matches += 1
            print()
        
        print(f"Matching questions/answers: {matches}/{len(questions_asked)}")
        print()
        
        # Analyze where divergence occurred
        if matches < len(questions_asked):
            print(f"🚨 Divergence detected at question {matches + 1}")
            if matches < len(sim_questions):
                print(f"Expected next question: {sim_questions[matches]}")
                print(f"Expected next answer: {sim_answers[matches]}")
        
        # Check final results
        print("📊 FINAL RESULTS COMPARISON")
        print("Your top 5:")
        for i, (name, score) in enumerate(final_top_5, 1):
            print(f"  {i}. {name}: {score}")
        
        print(f"\\nSimulated result: Analytical Idealism at rank #1 with score {sim_path['best_score']}")
        
        # Check if Analytical Idealism is in user's top 5
        user_ai_rank = None
        for i, (name, score) in enumerate(final_top_5, 1):
            if 'Idealism' in name and 'Analytical' in name:
                user_ai_rank = i
                break
        
        if user_ai_rank:
            print(f"✅ Analytical Idealism found in your results at rank #{user_ai_rank}")
        else:
            print("❌ Analytical Idealism NOT in your top 5")
    
    else:
        print("❌ Analytical Idealism not found in simulation results")

def investigate_stopping_conditions():
    """Investigate why the quiz might stop early."""
    print("\\n🛑 STOPPING CONDITIONS ANALYSIS")
    print("=" * 40)
    
    print("Possible reasons the quiz stopped at 16 questions:")
    print("1. Diminishing returns: Score changes became too small")
    print("2. High confidence: Leading cosmology had sufficient advantage") 
    print("3. Question pool exhausted: No more viable questions available")
    print("4. User profile: Conviction profile led to different question selection")
    print("5. Browser differences: Cache, storage, or session state issues")

# Example usage with placeholder data
if __name__ == "__main__":
    # User should replace these with their actual quiz data
    print("📝 TO USE THIS TOOL:")
    print("Replace the example data below with your actual quiz session data:")
    print()
    
    # Example data - user should replace this
    example_questions = [
        "Direct experience over doctrine",
        "One supreme being", 
        "Physical matter/energy as fundamental",
        # ... add your actual 16 questions here
    ]
    
    example_answers = [
        "N", "N", "N", 
        # ... add your actual 16 answers here
    ]
    
    example_final_top_5 = [
        ("Some Cosmology", 150.0),
        ("Another Cosmology", 140.0),
        # ... add your actual top 5 results here
    ]
    
    print("Example analysis (replace with your data):")
    # analyze_partial_path(example_questions, example_answers, example_final_top_5)
    investigate_stopping_conditions()