#!/usr/bin/env python3
"""
Debug Stopping Point

Compare where the simulation stops vs where the real quiz continued.
"""

import json
from exact_quiz_simulator import ExactQuizEngine

def debug_stopping_point():
    """Find exactly where and why the simulation stops."""
    
    # Load data
    with open('public/data/cosmology_features.json', 'r') as f:
        cosmologies_data = json.load(f)
    
    with open('public/data/question_library_v3.json', 'r') as f:
        questions_data = json.load(f)
    
    # The exact simulation answers and the real quiz answers
    simulation_answers = "NNNYNNNNNYNNYYYYNN"  # 18 questions - where simulation stopped
    real_quiz_answers = "NNNYNNNNNYNNYYYYNNYYYNYYYYY"  # 27 questions - where real quiz stopped
    
    print("🔍 DEBUGGING STOPPING POINT DISCREPANCY")
    print("=" * 80)
    print(f"Simulation answers: {simulation_answers} ({len(simulation_answers)} questions)")
    print(f"Real quiz answers:  {real_quiz_answers} ({len(real_quiz_answers)} questions)")
    print(f"Extra questions:    {''.join(real_quiz_answers[len(simulation_answers):])}")
    print()
    
    # Simulate using the exact engine in "auto" mode for Analytical Idealism
    engine = ExactQuizEngine(cosmologies_data, questions_data)
    
    try:
        # Run the exact simulation that generated the 18-question path
        result = engine.simulate_exact_quiz(
            target_cosmology='Analytical Idealism',
            max_questions=30,
            strategy='auto',
            verbose=True  # Enable verbose logging
        )
        
        if result:
            print(f"✅ SIMULATION COMPLETED:")
            print(f"   Questions asked: {len(result.questions_asked)}")
            print(f"   Answers given: {''.join(result.answers_given)}")
            print(f"   Final rank: #{result.final_rank}")
            print(f"   Final score: {result.final_score}")
            
            print(f"\n📊 QUESTION BY QUESTION BREAKDOWN:")
            for i, (q, a) in enumerate(zip(result.questions_asked, result.answers_given)):
                print(f"   {i+1:2d}. {q} → {a}")
            
            # Check why it stopped at question 18
            if len(result.simulation_steps) >= 18:
                step_18 = result.simulation_steps[17]  # 0-indexed
                print(f"\n🛑 SIMULATION STOPPED AFTER QUESTION 18:")
                print(f"   Question: {step_18['question']}")
                print(f"   Answer: {step_18['answer']}")
                print(f"   Active cosmologies: {step_18['active_cosmologies']}")
                print(f"   Target rank: #{step_18['target_rank']}")
                print(f"   Target score: {step_18['target_score']}")
        
        else:
            print("❌ SIMULATION FAILED")
    
    except Exception as e:
        print(f"❌ ERROR: {e}")
    
    print(f"\n" + "=" * 80)
    print("ANALYSIS:")
    print(f"The simulation found an optimal 18-question path, but the real quiz")
    print(f"continued asking {len(real_quiz_answers) - len(simulation_answers)} more questions.")
    print(f"This suggests the real quiz doesn't stop when it reaches an optimal result,")
    print(f"but continues until the stopping conditions are truly met.")

if __name__ == "__main__":
    debug_stopping_point()