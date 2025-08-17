#!/usr/bin/env python3
"""
Exact Quiz Simulator

This script perfectly mirrors the TypeScript quiz engine implementation,
including all advanced features like concept boosts, exclusions, and precise scoring.
"""

import json
import random
import math
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

@dataclass
class ExactQuizPath:
    """Exact path result matching the TypeScript quiz engine."""
    cosmology_name: str
    category: str
    final_rank: int
    final_score: float
    questions_asked: List[str]
    answers_given: List[str]
    question_scores: List[float]
    strategy_used: str
    attempts_tested: int
    simulation_steps: List[Dict]
    total_questions: int

class ExactQuizEngine:
    """
    Perfect replica of the TypeScript quiz engine with all features:
    - Exact CONFIG constants
    - Concept boosts and eliminations
    - Question exclusions
    - Advanced scoring logic
    - All bonuses and penalties
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
        
        # Confidence Interval Settings
        self.MIN_CONFIDENCE = 0.6
        self.CONFIDENCE_QUESTIONS_FACTOR = 0.1
        self.STABILITY_WINDOW = 5
        
        # Tie Resolution
        self.MAX_TIE_COSMOLOGIES = 5
        
        # Ultra-skeptical cosmologies (get +5 for uncertainty)
        self.ultra_skeptical = {
            'Open Skeptic', 'Mystical Agnosticism', 
            'Epistemological Agnosticism', 'Perpetual Inquiry'
        }
        
        # Core skeptical cosmologies (get +4 for uncertainty)  
        self.core_skeptical = {
            'Transitional Seeking', 'Philosophical Spirituality', 'Pragmatic Spirituality'
        }
    
    def find_optimal_path(self, target_cosmology: str, max_attempts: int = 100) -> Optional[ExactQuizPath]:
        """Find the optimal path using the exact TypeScript logic."""
        
        print(f"🎯 Finding EXACT optimal path for: {target_cosmology}")
        
        best_result = None
        strategies = ["auto", "targeted", "uncertainty", "random"]
        attempts_per_strategy = max_attempts // len(strategies)
        total_attempts = 0
        
        for strategy in strategies:
            print(f"  Trying {strategy} strategy...")
            
            for attempt in range(attempts_per_strategy):
                total_attempts += 1
                
                try:
                    # Vary max questions based on strategy
                    if strategy == "uncertainty":
                        max_questions = 25
                    elif strategy == "random":
                        max_questions = random.randint(10, 20)
                    else:
                        max_questions = 18
                    
                    path = self.simulate_exact_quiz(
                        target_cosmology=target_cosmology,
                        max_questions=max_questions,
                        strategy=strategy,
                        verbose=False
                    )
                    
                    if path and path.final_rank <= 5:
                        if best_result is None or path.final_rank < best_result.final_rank:
                            # Get cosmology category
                            category = "Unknown"
                            for cosmo in self.cosmologies:
                                if cosmo['Cosmology'] == target_cosmology:
                                    category = cosmo['Category']
                                    break
                            
                            best_result = ExactQuizPath(
                                cosmology_name=target_cosmology,
                                category=category,
                                final_rank=path.final_rank,
                                final_score=path.final_score,
                                questions_asked=path.questions_asked,
                                answers_given=path.answers_given,
                                question_scores=path.question_scores,
                                strategy_used=strategy,
                                attempts_tested=total_attempts,
                                simulation_steps=path.simulation_steps,
                                total_questions=path.total_questions
                            )
                            
                            print(f"    New best: Rank #{path.final_rank}, Score {path.final_score:.1f} ({strategy}, attempt {total_attempts})")
                            
                            if path.final_rank == 1:
                                return best_result
                
                except Exception as e:
                    print(f"    Error in attempt {total_attempts}: {e}")
                    continue
        
        if best_result:
            print(f"  ✅ Final best: Rank #{best_result.final_rank}, Score {best_result.final_score:.1f}")
        else:
            print(f"  ❌ Could not find any path for {target_cosmology}")
        
        return best_result
    
    def simulate_exact_quiz(self, target_cosmology: str, max_questions: int = 30, 
                           strategy: str = "auto", verbose: bool = False) -> Optional['ExactPath']:
        """Simulate quiz using EXACT TypeScript logic."""
        
        # Initialize state EXACTLY like TypeScript
        scores = [0 for _ in self.cosmologies]  # Start at 0, not 50!
        conviction_profile = defaultdict(lambda: {"pro": 0, "con": 0})
        asked_questions = set(['Order', 'Category', 'Cosmology'])  # Skip these columns
        asked_concepts = set()
        dont_know_count = 0
        session_answers = []
        
        questions_asked = []
        answers_given = []
        question_scores = []
        simulation_steps = []
        
        question_number = 0
        
        while question_number < max_questions:
            # Get active cosmologies (score > SCORE_ELIMINATE)
            active_cosmologies = [
                self.cosmologies[i] for i, score in enumerate(scores) 
                if score > self.SCORE_ELIMINATE
            ]
            
            if len(active_cosmologies) <= 1:
                break
            
            # Find next question using EXACT TypeScript logic
            next_question = self._find_next_question_exact(
                active_cosmologies, asked_questions, conviction_profile, 
                asked_concepts, dont_know_count, verbose
            )
            
            if not next_question:
                break
            
            question_key, question_data, question_score = next_question
            questions_asked.append(question_key)
            question_scores.append(question_score.total_score)
            asked_questions.add(question_key)
            
            # Determine answer based on strategy
            answer = self._determine_answer(
                question_key, question_data, target_cosmology, strategy, 
                conviction_profile, verbose
            )
            answers_given.append(answer)
            
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
            
            # Record simulation step
            active_count = sum(1 for s in scores if s > self.SCORE_ELIMINATE)
            simulation_steps.append({
                "question_number": question_number + 1,
                "question": question_key,
                "answer": answer,
                "eliminated_count": len(eliminated) if eliminated else 0,
                "active_cosmologies": active_count,
                "target_score": self._get_cosmology_score(target_cosmology, scores),
                "target_rank": self._get_cosmology_rank(target_cosmology, scores)
            })
            
            question_number += 1
            
            # Check stopping conditions like TypeScript
            if self._should_stop_quiz_exact(active_cosmologies, question_number, question_score):
                break
        
        # Generate final results
        final_rank = self._get_cosmology_rank(target_cosmology, scores)
        final_score = self._get_cosmology_score(target_cosmology, scores)
        
        # Get target category
        target_category = "Unknown"
        for cosmo in self.cosmologies:
            if cosmo['Cosmology'] == target_cosmology:
                target_category = cosmo['Category']
                break
        
        # Create a simple result object for internal use
        class ExactPath:
            def __init__(self, cosmology_name, category, final_rank, final_score, 
                        questions_asked, answers_given, question_scores, simulation_steps, total_questions):
                self.cosmology_name = cosmology_name
                self.category = category
                self.final_rank = final_rank
                self.final_score = final_score
                self.questions_asked = questions_asked
                self.answers_given = answers_given
                self.question_scores = question_scores
                self.simulation_steps = simulation_steps
                self.total_questions = total_questions
        
        return ExactPath(
            cosmology_name=target_cosmology,
            category=target_category,
            final_rank=final_rank,
            final_score=final_score,
            questions_asked=questions_asked,
            answers_given=answers_given,
            question_scores=question_scores,
            simulation_steps=simulation_steps,
            total_questions=question_number
        )
    
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
    
    def _score_question_exact(self, question_key: str, question_data: Dict, 
                             active_cosmologies: List[Dict], conviction_profile: Dict,
                             asked_concepts: Set[str], dont_know_count: int) -> QuestionScore:
        """Score question using EXACT TypeScript logic from useQuestionScoring.ts"""
        
        # Calculate basic eliminations
        yes_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'DB')
        no_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'R')
        product_score = yes_eliminated * no_eliminated
        
        # Calculate answer probabilities based on user profile
        p_yes, p_no = self._estimate_answer_probabilities_exact(question_data, conviction_profile)
        
        # Information theory modifier (entropy)
        entropy_modifier = 0.0
        if p_yes > self.MIN_PROBABILITY and p_no > self.MIN_PROBABILITY:
            entropy_modifier = -((p_yes * math.log2(p_yes)) + (p_no * math.log2(p_no)))
        
        # Calculate bonuses using EXACT TypeScript logic
        bonuses = self._calculate_question_bonuses_exact(question_data, conviction_profile, asked_concepts)
        
        # Uncertainty handling bonus
        uncertainty_bonus = 1.0
        if dont_know_count >= 2:
            clarification = question_data.get('clarification', '')
            if clarification and len(clarification) > 50:
                uncertainty_bonus = self.UNCERTAINTY_BONUS
        
        # Apply predictable question penalty
        predictable_penalty = 1.0
        if p_yes < 0.2 or p_yes > 0.8:
            predictable_penalty = self.PREDICTABLE_QUESTION_PENALTY
        
        # Combine all factors EXACTLY like TypeScript
        base_score = product_score * bonuses['total_bonus'] * predictable_penalty
        entropy_contribution = entropy_modifier * self.ENTROPY_WEIGHT * base_score
        total_score = (base_score + entropy_contribution) * uncertainty_bonus
        
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
            potential_eliminations=yes_eliminated + no_eliminated,
            bonuses=bonuses
        )
    
    def _estimate_answer_probabilities_exact(self, question_data: Dict, 
                                           conviction_profile: Dict) -> Tuple[float, float]:
        """EXACT TypeScript logic from useQuestionScoring.ts"""
        p_yes = 0.5
        total_evidence = 0
        yes_evidence = 0
        
        for concept in question_data.get('concepts', []):
            tag = concept['tag']
            polarity = concept['polarity']
            
            if tag in conviction_profile:
                pro_count = conviction_profile[tag]['pro']
                con_count = conviction_profile[tag]['con']
                
                total_evidence += pro_count + con_count
                
                if polarity == 'pro':
                    yes_evidence += pro_count
                else:
                    yes_evidence += con_count
        
        # Update probability based on evidence
        if total_evidence > 0:
            p_yes = yes_evidence / total_evidence
            # Don't let it get too extreme
            p_yes = max(self.MIN_PROBABILITY, min(1 - self.MIN_PROBABILITY, p_yes))
        
        return p_yes, 1 - p_yes
    
    def _calculate_question_bonuses_exact(self, question_data: Dict, conviction_profile: Dict,
                                        asked_concepts: Set[str]) -> Dict[str, float]:
        """EXACT TypeScript logic from useQuestionScoring.ts"""
        consistency_bonus = 1.0
        conviction_penalty = 1.0
        drill_down_bonus = 1.0
        novelty_bonus = 1.0
        
        # Apply original bonus logic
        for concept in question_data.get('concepts', []):
            tag = concept['tag']
            polarity = concept['polarity']
            
            if tag in conviction_profile:
                profile = conviction_profile[tag]
                current_polarity = profile.get(polarity, 0)
                opposite_polarity = profile.get('con' if polarity == 'pro' else 'pro', 0)
                
                # Consistency bonus
                if current_polarity == 0 and opposite_polarity > 0:
                    consistency_bonus = self.CONSISTENCY_BONUS
                
                # Conviction penalty
                if current_polarity >= self.STRONG_STANCE_THRESHOLD and opposite_polarity == 0:
                    conviction_penalty = 1 / self.CONVICTION_PENALTY_FACTOR
                
                # Drill down bonus
                if profile['pro'] + profile['con'] == 1:
                    drill_down_bonus = self.DRILL_DOWN_BONUS
        
        # Novelty bonus - check if question concepts are subset of asked concepts
        question_concepts = set(c['tag'] for c in question_data.get('concepts', []))
        if not question_concepts.issubset(asked_concepts):
            novelty_bonus = self.NOVELTY_BONUS
        
        total_bonus = consistency_bonus * novelty_bonus * conviction_penalty * drill_down_bonus
        
        return {
            'total_bonus': total_bonus,
            'consistency_bonus': consistency_bonus,
            'conviction_penalty': conviction_penalty,
            'drill_down_bonus': drill_down_bonus,
            'novelty_bonus': novelty_bonus
        }
    
    def _update_conviction_profile_exact(self, question_data: Dict, answer: str, 
                                       conviction_profile: Dict, asked_concepts: Set[str]):
        """EXACT TypeScript logic from useQuizEngine.ts"""
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
    
    def _process_answer_exact(self, question_key: str, answer: str, scores: List[float],
                            conviction_profile: Dict, asked_concepts: Set[str], 
                            dont_know_count: int, session_answers: List, 
                            verbose: bool = False) -> List[Dict]:
        """EXACT TypeScript logic from useQuestionScoring.ts"""
        
        eliminated = []
        
        if answer == '?':
            # Handle uncertainty scoring EXACTLY like TypeScript
            for i, cosmology in enumerate(self.cosmologies):
                cosmology_name = cosmology['Cosmology']
                relation = cosmology.get(question_key, '')
                is_eliminated = scores[i] <= self.SCORE_ELIMINATE
                
                # Ultra-skeptical cosmologies get +5
                if cosmology_name in self.ultra_skeptical:
                    if not is_eliminated:
                        scores[i] += 5
                # Core skeptical cosmologies get +4  
                elif cosmology_name in self.core_skeptical:
                    if not is_eliminated:
                        scores[i] += 4
                # Uncertainty-friendly cosmologies get +2
                elif cosmology.get('Comfortable with uncertainty') == 'R':
                    if not is_eliminated:
                        scores[i] += 2
                # Penalty for requiring certainty (applies even to eliminated)
                elif relation == 'R':
                    scores[i] += self.UNCERTAINTY_PENALTY
        
        else:
            # Handle Y/N answers with EXACT TypeScript logic
            for i, cosmology in enumerate(self.cosmologies):
                relation = cosmology.get(question_key, '')
                cosmology_name = cosmology['Cosmology']
                category = cosmology['Category']
                is_eliminated = scores[i] <= self.SCORE_ELIMINATE
                
                if answer == 'Y':
                    if relation == 'R':
                        if not is_eliminated:
                            scores[i] += 10
                        else:
                            scores[i] += 5  # Can still gain points after elimination
                    elif relation == 'NR':
                        if not is_eliminated:
                            scores[i] += 3
                        else:
                            scores[i] += 2
                    elif relation == 'DB':
                        if not is_eliminated:
                            scores[i] = self.SCORE_ELIMINATE
                            eliminated.append({'name': cosmology_name, 'category': category})
                        else:
                            scores[i] -= 10  # Continue losing points
                
                elif answer == 'N':
                    if relation == 'R':
                        if not is_eliminated:
                            scores[i] = self.SCORE_ELIMINATE
                            eliminated.append({'name': cosmology_name, 'category': category})
                        else:
                            scores[i] -= 10
                    elif relation == 'NR':
                        if not is_eliminated:
                            scores[i] += 3
                        else:
                            scores[i] += 2
                    elif relation == 'DB':
                        if not is_eliminated:
                            scores[i] += 10
                        else:
                            scores[i] += 5
        
        return eliminated
    
    def _process_exclusions_exact(self, excludes: Dict, scores: List[float], 
                                conviction_profile: Dict, asked_questions: Set[str]):
        """EXACT TypeScript logic from useQuizEngine.ts"""
        # Remove excluded questions from consideration
        excluded_questions = excludes.get('questions', [])
        for excluded_q in excluded_questions:
            asked_questions.add(excluded_q)
        
        # Apply penalties to excluded concepts
        excluded_concepts = excludes.get('concepts', [])
        for concept_tag in excluded_concepts:
            if concept_tag not in conviction_profile:
                conviction_profile[concept_tag] = {"pro": 0, "con": 0}
            conviction_profile[concept_tag]["con"] += 2
        
        # Eliminate excluded cosmologies directly
        excluded_cosmologies = excludes.get('cosmologies', [])
        for cosmology_name in excluded_cosmologies:
            index = next((i for i, c in enumerate(self.cosmologies) if c['Cosmology'] == cosmology_name), -1)
            if index != -1 and scores[index] > self.SCORE_ELIMINATE:
                scores[index] = self.SCORE_ELIMINATE
        
        # Eliminate cosmologies that require excluded concepts
        for concept_tag in excluded_concepts:
            self._eliminate_cosmologies_requiring_concept_exact(concept_tag, scores)
    
    def _eliminate_cosmologies_requiring_concept_exact(self, concept_tag: str, scores: List[float]):
        """EXACT TypeScript logic from useQuizEngine.ts"""
        for question_key, question in self.questions.items():
            if question_key not in self.cosmologies[0]:
                continue
            
            for concept in question.get('concepts', []):
                if concept['tag'] == concept_tag and concept['polarity'] == 'pro':
                    # Eliminate cosmologies that REQUIRE this concept
                    for i, cosmology in enumerate(self.cosmologies):
                        if scores[i] <= self.SCORE_ELIMINATE:
                            continue
                        
                        relation = cosmology.get(question_key, '')
                        if relation == 'R':
                            scores[i] = self.SCORE_ELIMINATE
    
    def _apply_concept_boosts_exact(self, conviction_profile: Dict, scores: List[float]):
        """EXACT TypeScript logic from useQuizEngine.ts"""
        for concept_tag, counts in conviction_profile.items():
            pro_count = counts['pro']
            
            if pro_count >= self.CONCEPT_ELIMINATION_THRESHOLD:
                # Find cosmologies that align with this concept
                for question_key, question in self.questions.items():
                    if question_key not in self.cosmologies[0]:
                        continue
                    
                    for concept in question.get('concepts', []):
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
    
    def _eliminate_rejected_concept_cosmologies_exact(self, conviction_profile: Dict, scores: List[float]):
        """EXACT TypeScript logic from useQuizEngine.ts"""
        for concept_tag, counts in conviction_profile.items():
            con_count = counts['con']
            
            if con_count >= self.CONCEPT_ELIMINATION_THRESHOLD:
                self._eliminate_cosmologies_requiring_concept_exact(concept_tag, scores)
    
    def _should_stop_quiz_exact(self, active_cosmologies: List[Dict], question_number: int, 
                              current_impact: QuestionScore) -> bool:
        """EXACT TypeScript logic from useQuizEngine.ts"""
        remaining = len(active_cosmologies)
        
        # Stop if only one left
        if remaining <= 1:
            return True
        
        # Stop if we've asked too many questions
        if question_number >= 30:
            return True
        
        # Check diminishing returns
        if question_number > self.MINIMUM_QUESTIONS:
            if (current_impact and 
                current_impact.potential_eliminations is not None and 
                current_impact.potential_eliminations <= self.DIMINISHING_RETURNS_THRESHOLD):
                return True
        
        return False
    
    def _determine_answer(self, question_key: str, question_data: Dict, target_cosmology: str,
                         strategy: str, conviction_profile: Dict, verbose: bool = False) -> str:
        """Determine how to answer the question based on strategy."""
        
        # Find target cosmology's relationship to this question
        target_relation = None
        for cosmo in self.cosmologies:
            if cosmo['Cosmology'] == target_cosmology:
                target_relation = cosmo.get(question_key, '')
                break
        
        if strategy == "targeted":
            # Answer to benefit the target cosmology
            if target_relation == 'R':
                return 'Y'
            elif target_relation == 'DB':
                return 'N'
            else:
                return random.choice(['Y', 'N'])
        
        elif strategy == "uncertainty":
            # Use uncertainty for skeptical cosmologies
            if target_cosmology in self.ultra_skeptical:
                return '?'
            elif target_cosmology in self.core_skeptical:
                return random.choice(['?', '?', 'Y'])  # Mostly uncertainty
            else:
                return random.choice(['Y', 'N', '?'])
        
        elif strategy == "random":
            return random.choice(['Y', 'N', '?'])
        
        else:  # "auto" - smart strategy
            # Use targeted approach but with some uncertainty for skeptical cosmologies
            if target_cosmology in self.ultra_skeptical:
                return random.choice(['?', '?', '?', 'Y'])  # Mostly uncertainty
            elif target_cosmology in self.core_skeptical:
                return random.choice(['?', '?', 'Y', 'N'])  # Some uncertainty
            else:
                # Targeted approach
                if target_relation == 'R':
                    return 'Y'
                elif target_relation == 'DB':
                    return 'N'
                else:
                    return random.choice(['Y', 'N'])
    
    def _get_cosmology_score(self, cosmology_name: str, scores: List[float]) -> float:
        """Get the current score for a specific cosmology."""
        for i, cosmo in enumerate(self.cosmologies):
            if cosmo['Cosmology'] == cosmology_name:
                return scores[i]
        return 0.0
    
    def _get_cosmology_rank(self, cosmology_name: str, scores: List[float]) -> int:
        """Get the current rank for a specific cosmology."""
        # Create results list
        results = []
        for i, cosmo in enumerate(self.cosmologies):
            results.append({
                'name': cosmo['Cosmology'],
                'score': scores[i]
            })
        
        # Sort by score (highest first)
        results.sort(key=lambda x: x['score'], reverse=True)
        
        # Find rank
        for rank, result in enumerate(results, 1):
            if result['name'] == cosmology_name:
                return rank
        
        return len(results)  # Not found

def main():
    """Generate exact optimal paths for all 110 cosmologies."""
    print("=" * 80)
    print("EXACT QUIZ ENGINE - PERFECT TYPESCRIPT REPLICA")
    print("=" * 80)
    
    # Load data
    print("Loading data...")
    with open('public/data/cosmology_features.json', 'r') as f:
        cosmologies_data = json.load(f)
    
    with open('public/data/question_library_v3.json', 'r') as f:
        questions_data = json.load(f)
    
    print(f"Loaded {len(cosmologies_data)} cosmologies and {len(questions_data)} questions")
    
    # Initialize exact engine
    engine = ExactQuizEngine(cosmologies_data, questions_data)
    
    # Generate optimal paths for all cosmologies
    all_exact_paths = {}
    unreachable_cosmologies = []
    failed_cosmologies = []
    
    print(f"\nGenerating EXACT optimal paths for all {len(cosmologies_data)} cosmologies...")
    print("=" * 60)
    
    for i, cosmology in enumerate(cosmologies_data):
        cosmology_name = cosmology['Cosmology']
        
        try:
            optimal_path = engine.find_optimal_path(cosmology_name, max_attempts=120)
            
            if optimal_path:
                if optimal_path.final_rank <= 5:  # Reachable in top 5
                    all_exact_paths[cosmology_name] = {
                        "category": optimal_path.category,
                        "best_rank": optimal_path.final_rank,
                        "best_score": optimal_path.final_score,
                        "strategy_used": optimal_path.strategy_used,
                        "attempts_tested": optimal_path.attempts_tested,
                        "total_questions": optimal_path.total_questions,
                        "questions_asked": optimal_path.questions_asked,
                        "answers_given": optimal_path.answers_given,
                        "question_scores": optimal_path.question_scores,
                        "simulation_steps": optimal_path.simulation_steps,
                        "path_summary": f"{optimal_path.total_questions} questions using {optimal_path.strategy_used} strategy"
                    }
                else:
                    unreachable_cosmologies.append({
                        "cosmology": cosmology_name,
                        "category": optimal_path.category,
                        "best_rank": optimal_path.final_rank,
                        "best_score": optimal_path.final_score,
                        "attempts": optimal_path.attempts_tested
                    })
            else:
                failed_cosmologies.append(cosmology_name)
            
            # Progress indicator
            progress = f"({i+1}/{len(cosmologies_data)})"
            if optimal_path and optimal_path.final_rank <= 5:
                status = "✅"
                rank_info = f" -> #{optimal_path.final_rank}"
            elif optimal_path:
                status = "⚠️"
                rank_info = f" -> #{optimal_path.final_rank} (not top 5)"
            else:
                status = "❌"
                rank_info = ""
            
            print(f"{progress} {status} {cosmology_name}{rank_info}")
            
        except Exception as e:
            print(f"({i+1}/{len(cosmologies_data)}) ❌ {cosmology_name} - Error: {e}")
            failed_cosmologies.append(cosmology_name)
    
    # Save results
    save_exact_results(all_exact_paths, unreachable_cosmologies, failed_cosmologies)
    
    print(f"\n" + "=" * 80)
    print("EXACT PATH GENERATION COMPLETE!")
    print("=" * 80)
    print(f"✅ Reachable (top 5): {len(all_exact_paths)}")
    print(f"⚠️  Unreachable (rank 6+): {len(unreachable_cosmologies)}")
    print(f"❌ Failed: {len(failed_cosmologies)}")

def save_exact_results(optimal_paths: Dict, unreachable: List[Dict], failed: List[str]):
    """Save all exact results to files."""
    print(f"\n💾 Saving EXACT results...")
    
    # Save successful exact paths
    with open('all_exact_optimal_paths.json', 'w') as f:
        json.dump(optimal_paths, f, indent=2)
    print(f"✅ Saved {len(optimal_paths)} EXACT optimal paths to all_exact_optimal_paths.json")
    
    # Save unreachable cosmologies
    if unreachable:
        with open('unreachable_exact_cosmologies.json', 'w') as f:
            json.dump(unreachable, f, indent=2)
        print(f"⚠️  Saved {len(unreachable)} unreachable cosmologies to unreachable_exact_cosmologies.json")
    
    # Save failed cosmologies
    if failed:
        with open('failed_exact_cosmologies.json', 'w') as f:
            json.dump(failed, f, indent=2)
        print(f"❌ Saved {len(failed)} failed cosmologies to failed_exact_cosmologies.json")

if __name__ == "__main__":
    main()