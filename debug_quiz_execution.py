#!/usr/bin/env python3
"""
Debug Quiz Execution

This script replays the exact permalink answers and shows detailed execution 
to identify where the TypeScript quiz and Python simulation diverge.
"""

import json
from typing import Dict, List, Tuple, Optional, Set, Any
from dataclasses import dataclass
from collections import defaultdict
import copy

# Import the exact quiz engine
from exact_quiz_simulator import ExactQuizEngine

def debug_permalink_execution():
    """Debug the exact execution of the permalink answers."""
    
    # The permalink answers to debug
    permalink_answers = "NNNYNNNNNYNNYYYYNNYYYNYYYYY"
    print(f"🔍 DEBUGGING PERMALINK EXECUTION")
    print(f"Permalink: {permalink_answers}")
    print(f"Length: {len(permalink_answers)} answers")
    print("=" * 80)
    
    # Load data
    with open('public/data/cosmology_features.json', 'r') as f:
        cosmologies_data = json.load(f)
    
    with open('public/data/question_library_v3.json', 'r') as f:
        questions_data = json.load(f)
    
    # Initialize engine
    engine = ExactQuizEngine(cosmologies_data, questions_data)
    
    # Decode answers
    answers = [char.upper() for char in permalink_answers]
    decoded_answers = []
    for char in answers:
        if char == 'Y':
            decoded_answers.append('Y')
        elif char == 'N':
            decoded_answers.append('N')
        elif char == 'U':
            decoded_answers.append('?')
        else:
            decoded_answers.append('N')  # fallback
    
    print(f"📝 DECODED ANSWERS: {decoded_answers}")
    print()
    
    # Initialize quiz state like TypeScript
    scores = [0 for _ in cosmologies_data]
    conviction_profile = defaultdict(lambda: {"pro": 0, "con": 0})
    asked_questions = set(['Order', 'Category', 'Cosmology'])
    asked_concepts = set()
    dont_know_count = 0
    session_answers = []
    
    questions_asked = []
    question_number = 0
    
    print("🎯 STEP-BY-STEP EXECUTION:")
    print("=" * 60)
    
    for i, answer in enumerate(decoded_answers):
        print(f"\n📍 QUESTION {i+1}:")
        print(f"   Target Answer: {answer}")
        
        # Get active cosmologies
        active_cosmologies = [
            cosmologies_data[j] for j, score in enumerate(scores) 
            if score > engine.SCORE_ELIMINATE
        ]
        
        print(f"   Active cosmologies: {len(active_cosmologies)}")
        
        # Check stopping conditions BEFORE finding next question
        remaining = len(active_cosmologies)
        should_stop_remaining = remaining <= 1
        should_stop_max_questions = question_number >= 30
        should_stop_diminishing = False
        
        if question_number > engine.MINIMUM_QUESTIONS:
            # We need to find the next question to check its potential eliminations
            pass  # Will check after finding question
        
        print(f"   Stopping checks (before finding question):")
        print(f"     - Remaining ≤ 1: {should_stop_remaining}")
        print(f"     - Questions ≥ 30: {should_stop_max_questions}")
        print(f"     - Question number: {question_number}")
        
        if should_stop_remaining or should_stop_max_questions:
            print(f"   🛑 WOULD STOP: Stopping condition met before finding question")
            break
        
        # Find next question using EXACT TypeScript logic
        next_question = engine._find_next_question_exact(
            active_cosmologies, asked_questions, conviction_profile, 
            asked_concepts, dont_know_count, verbose=False
        )
        
        if not next_question:
            print(f"   🛑 NO QUESTION FOUND: No viable questions available")
            break
        
        question_key, question_data, question_score = next_question
        questions_asked.append(question_key)
        asked_questions.add(question_key)
        
        print(f"   Question: '{question_key}'")
        print(f"   Potential eliminations: {question_score.potential_eliminations}")
        print(f"   Question score: {question_score.total_score:.2f}")
        
        # NOW check diminishing returns with the actual question
        if question_number > engine.MINIMUM_QUESTIONS:
            should_stop_diminishing = (question_score.potential_eliminations is not None and 
                                     question_score.potential_eliminations <= engine.DIMINISHING_RETURNS_THRESHOLD)
            print(f"     - Diminishing returns: {should_stop_diminishing} (eliminations: {question_score.potential_eliminations}, threshold: {engine.DIMINISHING_RETURNS_THRESHOLD})")
        
        # Check if we should stop AFTER finding the question (like TypeScript might do)
        if should_stop_diminishing:
            print(f"   🛑 WOULD STOP: Diminishing returns condition met")
            # But let's see if the simulation vs real quiz handles this differently
            print(f"   🤔 Continuing to process this question to see what happens...")
        
        # Process the answer
        eliminated = engine._process_answer_exact(
            question_key, answer, scores, conviction_profile, 
            asked_concepts, dont_know_count, session_answers, verbose=False
        )
        
        if answer == '?':
            dont_know_count += 1
        else:
            dont_know_count = 0
        
        # Update conviction profile
        engine._update_conviction_profile_exact(question_data, answer, conviction_profile, asked_concepts)
        
        # Process exclusions if answer was Yes
        if answer == 'Y' and question_data.get('excludes'):
            engine._process_exclusions_exact(question_data['excludes'], scores, conviction_profile, asked_questions)
        
        # Apply concept boosts and eliminations
        engine._apply_concept_boosts_exact(conviction_profile, scores)
        engine._eliminate_rejected_concept_cosmologies_exact(conviction_profile, scores)
        
        print(f"   Eliminated: {len(eliminated) if eliminated else 0} cosmologies")
        
        # Update session
        session_answers.append({"question": question_key, "answer": answer})
        question_number += 1
        
        # Get current rank of Analytical Idealism
        ai_rank = engine._get_cosmology_rank('Analytical Idealism', scores)
        ai_score = engine._get_cosmology_score('Analytical Idealism', scores)
        
        print(f"   Analytical Idealism: Rank #{ai_rank}, Score {ai_score}")
        
        # FINAL stopping check (what simulation does)
        final_active = [
            cosmologies_data[j] for j, score in enumerate(scores) 
            if score > engine.SCORE_ELIMINATE
        ]
        
        should_stop_final = engine._should_stop_quiz_exact(final_active, question_number, question_score)
        print(f"   Final stopping check: {should_stop_final}")
        
        if should_stop_final:
            print(f"   🛑 SIMULATION WOULD STOP HERE (after {question_number} questions)")
            print(f"   🎯 Real quiz continued to {len(decoded_answers)} questions")
            break
    
    print(f"\n" + "=" * 80)
    print(f"EXECUTION SUMMARY:")
    print(f"Questions processed: {question_number}")
    print(f"Total in permalink: {len(decoded_answers)}")
    print(f"Simulation stopped at: {question_number}")
    print(f"Real quiz continued to: {len(decoded_answers)}")

if __name__ == "__main__":
    debug_permalink_execution()