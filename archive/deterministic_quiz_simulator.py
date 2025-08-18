#!/usr/bin/env python3
"""
Deterministic Quiz Simulator

This simulator takes exact answers (from permalinks) and processes them through
the EXACT TypeScript quiz engine logic without any randomness or answer generation.
"""

import json
from typing import Dict, List, Tuple, Optional, Set, Any
from dataclasses import dataclass
from collections import defaultdict
import copy

@dataclass
class QuestionScore:
    """Exactly mirrors the QuestionScore interface from TypeScript."""
    total_score: float
    product_score: float
    entropy_modifier: float
    uncertainty_bonus: float
    predictable_penalty: float
    p_yes: float
    p_no: float
    yes_eliminated: int
    no_eliminated: int
    potential_eliminations: int
    bonuses: Dict[str, float]

class DeterministicQuizEngine:
    """
    Perfect replica of the TypeScript quiz engine that processes given answers
    without any randomness or strategy logic.
    """
    
    def __init__(self, cosmologies_data: List[Dict], questions_data: Dict):
        self.cosmologies = cosmologies_data
        self.questions = questions_data
        self.question_keys = [k for k in cosmologies_data[0].keys() 
                             if k not in ['Order', 'Category', 'Cosmology']]
        
        # EXACT CONFIG constants from TypeScript types/index.ts
        self.SCORE_ELIMINATE = -1000
        self.SCORE_HEAVY_PENALTY = -100
        self.CLEAR_WINNER_THRESHOLD = 5
        self.DIMINISHING_RETURNS_THRESHOLD = 2
        self.MINIMUM_QUESTIONS = 10
        
        # Bonuses and Penalties
        self.NOVELTY_BONUS = 1.5
        self.CONSISTENCY_BONUS = 4.0
        self.DRILL_DOWN_BONUS = 2.0
        self.CONVICTION_PENALTY_FACTOR = 4
        self.STRONG_STANCE_THRESHOLD = 2
        self.UNYIELDING_STANCE_THRESHOLD = 3
        self.CONCEPT_ELIMINATION_THRESHOLD = 3
        self.CONCEPT_BOOST_FACTOR = 1.5
        
        # Information Theory Parameters
        self.ENTROPY_WEIGHT = 0.3
        self.PREDICTABLE_QUESTION_PENALTY = 0.1
        self.MIN_PROBABILITY = 0.001
        self.UNCERTAINTY_BONUS = 1.2
        self.UNCERTAINTY_PENALTY = -2
        
        # Ultra-skeptical cosmologies (get +5 for uncertainty)
        self.ultra_skeptical = {
            'Open Skeptic', 'Mystical Agnosticism', 
            'Epistemological Agnosticism', 'Perpetual Inquiry'
        }
        
        # Core skeptical cosmologies (get +4 for uncertainty)  
        self.core_skeptical = {
            'Transitional Seeking', 'Philosophical Spirituality', 'Pragmatic Spirituality'
        }
    
    def process_permalink_answers(self, answers: List[str], verbose: bool = False) -> Dict:
        """Process a list of answers through the exact TypeScript quiz logic."""
        
        if verbose:
            print(f"🎯 PROCESSING {len(answers)} ANSWERS DETERMINISTICALLY")
            print("=" * 60)
        
        # Initialize state EXACTLY like TypeScript
        scores = [0 for _ in self.cosmologies]  # Start at 0, not 50!
        conviction_profile = defaultdict(lambda: {"pro": 0, "con": 0})
        asked_questions = set(['Order', 'Category', 'Cosmology'])  # Skip these columns
        asked_concepts = set()
        dont_know_count = 0
        session_answers = []
        
        questions_asked = []
        question_scores = []
        simulation_steps = []
        
        question_number = 0
        
        for i, answer in enumerate(answers):
            if verbose:
                print(f"\n📍 PROCESSING ANSWER {i+1}: {answer}")
            
            # Get active cosmologies
            active_cosmologies = [
                self.cosmologies[j] for j, score in enumerate(scores) 
                if score > self.SCORE_ELIMINATE
            ]
            
            if verbose:
                print(f"   Active cosmologies: {len(active_cosmologies)}")
            
            # Check stopping conditions BEFORE finding next question
            if len(active_cosmologies) <= 1:
                if verbose:
                    print(f"   🛑 STOPPING: Only {len(active_cosmologies)} cosmology remaining")
                break
            
            if question_number >= 30:
                if verbose:
                    print(f"   🛑 STOPPING: Reached max questions (30)")
                break
            
            # Find next question using EXACT TypeScript logic
            next_question = self._find_next_question_exact(
                active_cosmologies, asked_questions, conviction_profile, 
                asked_concepts, dont_know_count, verbose
            )
            
            if not next_question:
                if verbose:
                    print(f"   🛑 STOPPING: No viable questions found")
                break
            
            question_key, question_data, question_score = next_question
            questions_asked.append(question_key)
            question_scores.append(question_score.total_score)
            asked_questions.add(question_key)
            
            if verbose:
                print(f"   Question: '{question_key}'")
                print(f"   Potential eliminations: {question_score.potential_eliminations}")
                print(f"   Score: {question_score.total_score:.2f}")
            
            # Check diminishing returns AFTER finding question
            if question_number > self.MINIMUM_QUESTIONS:
                if (question_score.potential_eliminations is not None and 
                    question_score.potential_eliminations <= self.DIMINISHING_RETURNS_THRESHOLD):
                    if verbose:
                        print(f"   🛑 STOPPING: Diminishing returns (eliminations: {question_score.potential_eliminations} ≤ {self.DIMINISHING_RETURNS_THRESHOLD})")
                    break
            
            # Process the answer using EXACT TypeScript logic
            eliminated = self._process_answer_exact(
                question_key, answer, scores, conviction_profile, 
                asked_concepts, dont_know_count, session_answers, verbose
            )
            
            if answer == '?':
                dont_know_count += 1
            else:
                dont_know_count = 0  # Reset on definitive answer (TypeScript behavior)
            
            # Update conviction profile EXACTLY like TypeScript
            self._update_conviction_profile_exact(question_data, answer, conviction_profile, asked_concepts)
            
            # Process exclusions if user answered Yes
            if answer == 'Y' and question_data.get('excludes'):
                self._process_exclusions_exact(question_data['excludes'], scores, conviction_profile, asked_questions)
            
            # Apply concept boosts and eliminations
            self._apply_concept_boosts_exact(conviction_profile, scores)
            self._eliminate_rejected_concept_cosmologies_exact(conviction_profile, scores)
            
            # Record session answer
            session_answers.append({"question": question_key, "answer": answer})
            
            # Record simulation step
            active_count = sum(1 for s in scores if s > self.SCORE_ELIMINATE)
            simulation_steps.append({
                "question_number": question_number + 1,
                "question": question_key,
                "answer": answer,
                "eliminated_count": len(eliminated) if eliminated else 0,
                "active_cosmologies": active_count,
                "question_score": question_score.total_score
            })
            
            if verbose:
                print(f"   Eliminated: {len(eliminated) if eliminated else 0} cosmologies")
                print(f"   Active remaining: {active_count}")
            
            question_number += 1
        
        # Generate final results
        results = []
        for i, cosmo in enumerate(self.cosmologies):
            results.append({
                'name': cosmo['Cosmology'],
                'category': cosmo['Category'],
                'score': scores[i]
            })
        
        # Sort by score (highest first)
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return {
            'questions_asked': questions_asked,
            'answers_given': answers[:question_number],
            'question_scores': question_scores,
            'simulation_steps': simulation_steps,
            'total_questions': question_number,
            'final_results': results[:10],  # Top 10
            'all_scores': scores
        }
    
    def _find_next_question_exact(self, active_cosmologies: List[Dict], asked_questions: Set[str],
                                 conviction_profile: Dict, asked_concepts: Set[str], 
                                 dont_know_count: int, verbose: bool = False) -> Optional[Tuple[str, Dict, QuestionScore]]:
        """Find next question using EXACT TypeScript logic from useQuizEngine.ts"""
        
        # Get potential questions (not yet asked, in question library)
        potential_questions = [q for q in self.question_keys 
                             if q not in asked_questions and q in self.questions]
        
        if not potential_questions:
            return None
        
        # Filter to viable questions using EXACT TypeScript logic
        viable_questions = []
        for question_key in potential_questions:
            yes_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'DB')
            no_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'R')
            
            # Check if question involves concepts user has strongly rejected (TypeScript logic)
            question_data = self.questions.get(question_key)
            skip_question = False
            if question_data:
                for concept in question_data.get('concepts', []):
                    tag = concept['tag']
                    if tag in conviction_profile:
                        con_count = conviction_profile[tag]['con']
                        if con_count >= self.CONCEPT_ELIMINATION_THRESHOLD:
                            skip_question = True
                            break
            
            if not skip_question and (yes_eliminated > 0 or no_eliminated > 0):
                viable_questions.append(question_key)
        
        if not viable_questions:
            return None
        
        # Score all viable questions using EXACT TypeScript logic
        best_question = None
        best_score = -1
        best_question_score = None
        
        for question_key in viable_questions:
            question_data = self.questions.get(question_key)
            if not question_data:
                continue
            
            question_score = self._score_question_exact(
                question_key, question_data, active_cosmologies,
                conviction_profile, asked_concepts, dont_know_count
            )
            
            if question_score.total_score > best_score:
                best_score = question_score.total_score
                best_question = question_key
                best_question_score = question_score
        
        return (best_question, self.questions[best_question], best_question_score) if best_question else None
    
    def _score_question_exact(self, question_key: str, question_data: Dict, active_cosmologies: List[Dict],
                             conviction_profile: Dict, asked_concepts: Set[str], dont_know_count: int) -> QuestionScore:
        """Score a question using EXACT TypeScript logic."""
        import math
        
        yes_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'DB')
        no_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'R')
        total_active = len(active_cosmologies)
        
        if total_active == 0:
            return QuestionScore(0, 0, 0, 0, 0, 0, 0, yes_eliminated, no_eliminated, 0, {})
        
        # Calculate probabilities with minimum bounds
        p_yes = max(self.MIN_PROBABILITY, (total_active - yes_eliminated) / total_active)
        p_no = max(self.MIN_PROBABILITY, (total_active - no_eliminated) / total_active)
        
        # Calculate entropy modifier
        entropy_yes = -(p_yes * math.log2(p_yes)) if p_yes > 0 else 0
        entropy_no = -(p_no * math.log2(p_no)) if p_no > 0 else 0
        entropy_modifier = self.ENTROPY_WEIGHT * (entropy_yes + entropy_no)
        
        # Calculate base product score
        product_score = yes_eliminated * no_eliminated
        
        # Calculate bonuses
        bonuses = {}
        total_bonus = 0
        
        # Novelty bonus
        if question_key not in asked_concepts:
            bonuses['novelty'] = self.NOVELTY_BONUS
            total_bonus += self.NOVELTY_BONUS
        
        # Consistency bonus - questions that align with user's convictions
        consistency_bonus = 0
        for concept in question_data.get('concepts', []):
            tag = concept['tag']
            polarity = concept['polarity']
            
            if tag in conviction_profile:
                pro_count = conviction_profile[tag]['pro']
                con_count = conviction_profile[tag]['con']
                
                if polarity == 'pro' and pro_count >= self.STRONG_STANCE_THRESHOLD:
                    consistency_bonus += self.CONSISTENCY_BONUS
                elif polarity == 'con' and con_count >= self.STRONG_STANCE_THRESHOLD:
                    consistency_bonus += self.CONSISTENCY_BONUS
        
        if consistency_bonus > 0:
            bonuses['consistency'] = consistency_bonus
            total_bonus += consistency_bonus
        
        # Drill-down bonus for exploring concepts
        if any(concept['tag'] in asked_concepts for concept in question_data.get('concepts', [])):
            bonuses['drill_down'] = self.DRILL_DOWN_BONUS
            total_bonus += self.DRILL_DOWN_BONUS
        
        # Uncertainty bonus
        uncertainty_bonus = 0
        if dont_know_count >= 3:
            uncertainty_bonus = self.UNCERTAINTY_BONUS
            bonuses['uncertainty'] = uncertainty_bonus
            total_bonus += uncertainty_bonus
        
        # Predictable question penalty
        predictable_penalty = 0
        if min(yes_eliminated, no_eliminated) == 0:
            predictable_penalty = self.PREDICTABLE_QUESTION_PENALTY
        
        # Calculate potential eliminations
        potential_eliminations = max(yes_eliminated, no_eliminated)
        
        # Calculate total score
        total_score = (product_score + entropy_modifier + total_bonus - predictable_penalty)
        
        return QuestionScore(
            total_score=total_score,
            product_score=product_score,
            entropy_modifier=entropy_modifier,
            uncertainty_bonus=uncertainty_bonus,
            predictable_penalty=predictable_penalty,
            p_yes=p_yes,
            p_no=p_no,
            yes_eliminated=yes_eliminated,
            no_eliminated=no_eliminated,
            potential_eliminations=potential_eliminations,
            bonuses=bonuses
        )
    
    def _process_answer_exact(self, question_key: str, answer: str, scores: List[float],
                             conviction_profile: Dict, asked_concepts: Set[str], 
                             dont_know_count: int, session_answers: List[Dict], verbose: bool = False) -> List[str]:
        """Process an answer using EXACT TypeScript logic."""
        
        eliminated = []
        
        if answer in ['Y', 'N']:
            # Process answer for each cosmology
            for i, cosmology in enumerate(self.cosmologies):
                if scores[i] <= self.SCORE_ELIMINATE:
                    continue  # Already eliminated
                
                relation = cosmology.get(question_key, '')
                
                if answer == 'Y':
                    if relation == 'DB':  # Deal breaker
                        scores[i] = self.SCORE_ELIMINATE
                        eliminated.append(cosmology['Cosmology'])
                    elif relation == 'R':  # Required
                        scores[i] += 10
                    elif relation == 'NR':  # Not required
                        scores[i] += 2
                elif answer == 'N':
                    if relation == 'R':  # Required
                        scores[i] = self.SCORE_ELIMINATE
                        eliminated.append(cosmology['Cosmology'])
                    elif relation == 'DB':  # Deal breaker
                        scores[i] += 10
                    elif relation == 'NR':  # Not required
                        scores[i] += 2
        
        return eliminated
    
    def _update_conviction_profile_exact(self, question_data: Dict, answer: str, 
                                       conviction_profile: Dict, asked_concepts: Set[str]) -> None:
        """Update conviction profile using EXACT TypeScript logic."""
        
        if answer == '?':
            return
        
        for concept in question_data.get('concepts', []):
            tag = concept['tag']
            polarity = concept['polarity']
            
            # Initialize if not exists
            if tag not in conviction_profile:
                conviction_profile[tag] = {"pro": 0, "con": 0}
            
            asked_concepts.add(tag)
            
            if answer == 'Y':
                conviction_profile[tag][polarity] += 1
            elif answer == 'N':
                opposite = 'con' if polarity == 'pro' else 'pro'
                conviction_profile[tag][opposite] += 1
    
    def _process_exclusions_exact(self, excludes: Dict, scores: List[float], 
                                conviction_profile: Dict, asked_questions: Set[str]) -> None:
        """Process exclusions using EXACT TypeScript logic."""
        
        # Remove excluded questions from consideration
        excluded_questions = excludes.get('questions', [])
        for excluded_q in excluded_questions:
            asked_questions.add(excluded_q)
        
        # Apply penalties to excluded concepts
        excluded_concepts = excludes.get('concepts', [])
        for concept_tag in excluded_concepts:
            if concept_tag not in conviction_profile:
                conviction_profile[concept_tag] = {"pro": 0, "con": 0}
            conviction_profile[concept_tag]['con'] += 2
        
        # Eliminate excluded cosmologies directly
        excluded_cosmologies = excludes.get('cosmologies', [])
        for cosmology_name in excluded_cosmologies:
            for i, cosmology in enumerate(self.cosmologies):
                if cosmology['Cosmology'] == cosmology_name and scores[i] > self.SCORE_ELIMINATE:
                    scores[i] = self.SCORE_ELIMINATE
        
        # Eliminate cosmologies that require excluded concepts
        for concept_tag in excluded_concepts:
            self._eliminate_cosmologies_requiring_concept_exact(concept_tag, scores)
    
    def _eliminate_cosmologies_requiring_concept_exact(self, concept_tag: str, scores: List[float]) -> None:
        """Eliminate cosmologies requiring a concept using EXACT TypeScript logic."""
        
        for question_key, question_data in self.questions.items():
            if question_key not in self.question_keys:
                continue
            
            for concept in question_data.get('concepts', []):
                if concept['tag'] == concept_tag and concept['polarity'] == 'pro':
                    # Eliminate cosmologies that REQUIRE this concept
                    for i, cosmology in enumerate(self.cosmologies):
                        if scores[i] <= self.SCORE_ELIMINATE:
                            continue
                        
                        relation = cosmology.get(question_key, '')
                        if relation == 'R':
                            scores[i] = self.SCORE_ELIMINATE
    
    def _apply_concept_boosts_exact(self, conviction_profile: Dict, scores: List[float]) -> None:
        """Apply concept boosts using EXACT TypeScript logic."""
        
        for concept_tag, counts in conviction_profile.items():
            pro_count = counts['pro']
            
            if pro_count >= self.CONCEPT_ELIMINATION_THRESHOLD:
                # Find cosmologies that align with this concept
                for question_key, question_data in self.questions.items():
                    if question_key not in self.question_keys:
                        continue
                    
                    for concept in question_data.get('concepts', []):
                        if concept['tag'] == concept_tag and concept['polarity'] == 'pro':
                            # Boost cosmologies that require or benefit from this belief
                            for i, cosmology in enumerate(self.cosmologies):
                                if scores[i] <= self.SCORE_ELIMINATE:
                                    continue
                                
                                relation = cosmology.get(question_key, '')
                                if relation == 'R':
                                    scores[i] += int(5 * self.CONCEPT_BOOST_FACTOR)
                                elif relation == 'NR':
                                    scores[i] += int(2 * self.CONCEPT_BOOST_FACTOR)
    
    def _eliminate_rejected_concept_cosmologies_exact(self, conviction_profile: Dict, scores: List[float]) -> None:
        """Eliminate cosmologies for rejected concepts using EXACT TypeScript logic."""
        
        for concept_tag, counts in conviction_profile.items():
            con_count = counts['con']
            
            if con_count >= self.CONCEPT_ELIMINATION_THRESHOLD:
                self._eliminate_cosmologies_requiring_concept_exact(concept_tag, scores)
    
def main():
    """Test the deterministic simulator with the permalink answers."""
    
    # Load data
    with open('public/data/cosmology_features.json', 'r') as f:
        cosmologies_data = json.load(f)
    
    with open('public/data/question_library_v3.json', 'r') as f:
        questions_data = json.load(f)
    
    # The actual permalink answers
    permalink_answers = "NNNYNNNNNYNNYYYYNNYYYNYYYYY"
    
    # Decode answers
    decoded_answers = []
    for char in permalink_answers:
        if char == 'Y':
            decoded_answers.append('Y')
        elif char == 'N':
            decoded_answers.append('N')
        elif char == 'U':
            decoded_answers.append('?')
        else:
            decoded_answers.append('N')  # fallback
    
    print(f"🔍 DETERMINISTIC SIMULATION TEST")
    print(f"Permalink: {permalink_answers}")
    print(f"Decoded: {decoded_answers}")
    print(f"Length: {len(decoded_answers)}")
    print("=" * 80)
    
    # Initialize deterministic engine
    engine = DeterministicQuizEngine(cosmologies_data, questions_data)
    
    # Process the answers deterministically
    result = engine.process_permalink_answers(decoded_answers, verbose=True)
    
    print(f"\n" + "=" * 80)
    print(f"🎯 FINAL RESULTS:")
    print(f"Questions processed: {result['total_questions']}")
    print(f"Questions asked: {result['questions_asked']}")
    print(f"Answers given: {''.join(result['answers_given'])}")
    print(f"\nTop 5 Results:")
    for i, res in enumerate(result['final_results'][:5]):
        print(f"  {i+1}. {res['name']}: {res['score']}")

if __name__ == "__main__":
    main()