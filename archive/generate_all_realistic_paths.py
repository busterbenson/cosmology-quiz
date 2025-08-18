#!/usr/bin/env python3
"""
Generate All Realistic Cosmology Paths

This script generates realistic optimal paths for ALL 110 cosmologies using the 
proper quiz engine simulation that mirrors the actual TypeScript implementation.
"""

import json
import random
import math
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass
from collections import defaultdict
import copy

# Import the realistic quiz engine from the previous script
import sys
import os

# Add the realistic quiz engine components
@dataclass
class QuestionScore:
    """Mirrors the QuestionScore interface from TypeScript."""
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
class OptimalRealisticPath:
    """Optimal realistic path to reach a specific cosmology."""
    cosmology_name: str
    category: str
    best_rank: int
    best_score: float
    questions_asked: List[str]
    answers_given: List[str]
    question_scores: List[float]
    strategy_used: str
    attempts_tested: int
    simulation_steps: List[Dict]
    total_questions: int

class RealisticQuizEngine:
    """
    Accurately simulates the TypeScript quiz engine's behavior,
    including all scoring logic, question selection, and state management.
    """
    
    def __init__(self, cosmologies_data: List[Dict], questions_data: Dict):
        self.cosmologies = cosmologies_data
        self.questions = questions_data
        self.question_keys = [k for k in cosmologies_data[0].keys() 
                             if k not in ['Order', 'Category', 'Cosmology']]
        
        # Scoring constants (from CONFIG in types/index.ts)
        self.SCORE_ELIMINATE = -1000
        self.INITIAL_SCORE = 50
        self.MIN_PROBABILITY = 0.1
        self.ENTROPY_WEIGHT = 0.3
        self.UNCERTAINTY_BONUS = 1.2
        self.PREDICTABLE_QUESTION_PENALTY = 0.7
        self.CONSISTENCY_BONUS = 1.5
        self.CONVICTION_PENALTY_FACTOR = 2.0
        self.DRILL_DOWN_BONUS = 1.3
        self.NOVELTY_BONUS = 1.2
        self.STRONG_STANCE_THRESHOLD = 3
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
    
    def find_optimal_realistic_path(self, target_cosmology: str, max_attempts: int = 100) -> Optional[OptimalRealisticPath]:
        """Find the optimal realistic path using multiple strategies and attempts."""
        
        print(f"🎯 Finding optimal realistic path for: {target_cosmology}")
        
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
                        max_questions = 25  # Uncertainty needs more questions
                    elif strategy == "random":
                        max_questions = random.randint(10, 20)
                    else:
                        max_questions = 18
                    
                    path = self.simulate_realistic_quiz(
                        target_cosmology=target_cosmology,
                        max_questions=max_questions,
                        strategy=strategy,
                        verbose=False
                    )
                    
                    if path and path.final_rank <= 5:  # Only consider top 5 results
                        # Update best if this is better (lower rank = better)
                        if best_result is None or path.final_rank < best_result.best_rank:
                            # Get cosmology category
                            category = "Unknown"
                            for cosmo in self.cosmologies:
                                if cosmo['Cosmology'] == target_cosmology:
                                    category = cosmo['Category']
                                    break
                            
                            best_result = OptimalRealisticPath(
                                cosmology_name=target_cosmology,
                                category=category,
                                best_rank=path.final_rank,
                                best_score=path.final_score,
                                questions_asked=path.questions_asked,
                                answers_given=path.answers_given,
                                question_scores=path.question_scores,
                                strategy_used=strategy,
                                attempts_tested=total_attempts,
                                simulation_steps=path.simulation_steps,
                                total_questions=path.total_questions
                            )
                            
                            print(f"    New best: Rank #{path.final_rank}, Score {path.final_score:.1f} ({strategy}, attempt {total_attempts})")
                            
                            # If we got rank 1, that's optimal
                            if path.final_rank == 1:
                                return best_result
                
                except Exception as e:
                    print(f"    Error in attempt {total_attempts}: {e}")
                    continue
        
        if best_result:
            print(f"  ✅ Final best: Rank #{best_result.best_rank}, Score {best_result.best_score:.1f}")
        else:
            print(f"  ❌ Could not find any path for {target_cosmology}")
        
        return best_result
    
    def simulate_realistic_quiz(self, target_cosmology: str, max_questions: int = 20, 
                               strategy: str = "auto", verbose: bool = False) -> Optional['RealisticPath']:
        """Simulate a complete quiz session using the actual quiz engine logic."""
        
        # Initialize quiz state (mirrors TypeScript state)
        scores = [self.INITIAL_SCORE for _ in self.cosmologies]
        conviction_profile = defaultdict(lambda: {"pro": 0, "con": 0})
        asked_questions = set()
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
            
            # Find next question using actual quiz engine logic
            next_question = self._find_next_question(
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
            
            # Process the answer (update scores, conviction profile)
            eliminated = self._process_answer(
                question_key, answer, scores, conviction_profile, 
                asked_concepts, dont_know_count, session_answers, verbose
            )
            
            if answer == '?':
                dont_know_count += 1
            
            # Update conviction profile
            if answer != '?':
                for concept in question_data.get('concepts', []):
                    tag = concept['tag']
                    polarity = concept['polarity']
                    asked_concepts.add(tag)
                    
                    if tag not in conviction_profile:
                        conviction_profile[tag] = {"pro": 0, "con": 0}
                    
                    if (answer == 'Y' and polarity == 'pro') or (answer == 'N' and polarity == 'con'):
                        conviction_profile[tag]["pro"] += 1
                    elif (answer == 'Y' and polarity == 'con') or (answer == 'N' and polarity == 'pro'):
                        conviction_profile[tag]["con"] += 1
            
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
        class RealisticPath:
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
        
        return RealisticPath(
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
    
    def _find_next_question(self, active_cosmologies: List[Dict], asked_questions: Set[str],
                           conviction_profile: Dict, asked_concepts: Set[str], 
                           dont_know_count: int, verbose: bool = False) -> Optional[Tuple[str, Dict, QuestionScore]]:
        """Find the next question using the actual quiz engine scoring algorithm."""
        
        # Get potential questions (not yet asked)
        potential_questions = [q for q in self.question_keys if q not in asked_questions]
        
        if not potential_questions:
            return None
        
        # Filter to viable questions (can eliminate cosmologies)
        viable_questions = []
        for question_key in potential_questions:
            yes_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'DB')
            no_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'R')
            
            if yes_eliminated > 0 or no_eliminated > 0:
                viable_questions.append(question_key)
        
        if not viable_questions:
            return None
        
        # Score all viable questions
        best_question = None
        best_score = -1
        best_question_score = None
        
        for question_key in viable_questions:
            question_data = self.questions.get(question_key)
            if not question_data:
                continue
            
            question_score = self._score_question(
                question_key, question_data, active_cosmologies,
                conviction_profile, asked_concepts, dont_know_count
            )
            
            if question_score.total_score > best_score:
                best_score = question_score.total_score
                best_question = question_key
                best_question_score = question_score
        
        return (best_question, self.questions[best_question], best_question_score) if best_question else None
    
    def _score_question(self, question_key: str, question_data: Dict, 
                       active_cosmologies: List[Dict], conviction_profile: Dict,
                       asked_concepts: Set[str], dont_know_count: int) -> QuestionScore:
        """Score a question using the exact algorithm from useQuestionScoring.ts"""
        
        # Calculate basic eliminations
        yes_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'DB')
        no_eliminated = sum(1 for c in active_cosmologies if c.get(question_key) == 'R')
        product_score = yes_eliminated * no_eliminated
        
        # Calculate answer probabilities based on user profile
        p_yes, p_no = self._estimate_answer_probabilities(question_data, conviction_profile)
        
        # Information theory modifier (entropy)
        entropy_modifier = 0.0
        if p_yes > self.MIN_PROBABILITY and p_no > self.MIN_PROBABILITY:
            entropy_modifier = -((p_yes * math.log2(p_yes)) + (p_no * math.log2(p_no)))
        
        # Calculate bonuses
        bonuses = self._calculate_question_bonuses(question_data, conviction_profile, asked_concepts)
        
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
        
        # Combine all factors
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
    
    def _estimate_answer_probabilities(self, question_data: Dict, 
                                     conviction_profile: Dict) -> Tuple[float, float]:
        """Estimate answer probabilities based on user's conviction profile."""
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
    
    def _calculate_question_bonuses(self, question_data: Dict, conviction_profile: Dict,
                                  asked_concepts: Set[str]) -> Dict[str, float]:
        """Calculate question bonuses (consistency, novelty, etc.)"""
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
        
        # Novelty bonus
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
    
    def _process_answer(self, question_key: str, answer: str, scores: List[float],
                       conviction_profile: Dict, asked_concepts: Set[str], 
                       dont_know_count: int, session_answers: List, 
                       verbose: bool = False) -> List[Dict]:
        """Process an answer and update scores (mirrors processAnswer from useQuestionScoring.ts)"""
        
        eliminated = []
        
        if answer == '?':
            # Handle uncertainty scoring
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
            # Handle Y/N answers with enhanced post-elimination scoring
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
    """Generate realistic optimal paths for all 110 cosmologies."""
    print("=" * 80)
    print("GENERATE ALL REALISTIC OPTIMAL PATHS")
    print("=" * 80)
    
    # Load data
    print("Loading data...")
    with open('public/data/cosmology_features.json', 'r') as f:
        cosmologies_data = json.load(f)
    
    with open('public/data/question_library_v3.json', 'r') as f:
        questions_data = json.load(f)
    
    print(f"Loaded {len(cosmologies_data)} cosmologies and {len(questions_data)} questions")
    
    # Initialize realistic engine
    engine = RealisticQuizEngine(cosmologies_data, questions_data)
    
    # Generate optimal paths for all cosmologies
    all_optimal_paths = {}
    unreachable_cosmologies = []
    failed_cosmologies = []
    
    print(f"\nGenerating realistic optimal paths for all {len(cosmologies_data)} cosmologies...")
    print("=" * 60)
    
    for i, cosmology in enumerate(cosmologies_data):
        cosmology_name = cosmology['Cosmology']
        
        try:
            optimal_path = engine.find_optimal_realistic_path(cosmology_name, max_attempts=120)
            
            if optimal_path:
                if optimal_path.best_rank <= 5:  # Reachable in top 5
                    all_optimal_paths[cosmology_name] = {
                        "category": optimal_path.category,
                        "best_rank": optimal_path.best_rank,
                        "best_score": optimal_path.best_score,
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
                        "best_rank": optimal_path.best_rank,
                        "best_score": optimal_path.best_score,
                        "attempts": optimal_path.attempts_tested
                    })
            else:
                failed_cosmologies.append(cosmology_name)
            
            # Progress indicator
            progress = f"({i+1}/{len(cosmologies_data)})"
            if optimal_path and optimal_path.best_rank <= 5:
                status = "✅"
                rank_info = f" -> #{optimal_path.best_rank}"
            elif optimal_path:
                status = "⚠️"
                rank_info = f" -> #{optimal_path.best_rank} (not top 5)"
            else:
                status = "❌"
                rank_info = ""
            
            print(f"{progress} {status} {cosmology_name}{rank_info}")
            
        except Exception as e:
            print(f"({i+1}/{len(cosmologies_data)}) ❌ {cosmology_name} - Error: {e}")
            failed_cosmologies.append(cosmology_name)
    
    # Save results
    save_all_results(all_optimal_paths, unreachable_cosmologies, failed_cosmologies)
    generate_comprehensive_report(all_optimal_paths, unreachable_cosmologies, failed_cosmologies)
    
    print("\n" + "=" * 80)
    print("REALISTIC PATH GENERATION COMPLETE!")
    print("=" * 80)
    print(f"✅ Reachable (top 5): {len(all_optimal_paths)}")
    print(f"⚠️  Unreachable (rank 6+): {len(unreachable_cosmologies)}")
    print(f"❌ Failed: {len(failed_cosmologies)}")

def save_all_results(optimal_paths: Dict, unreachable: List[Dict], failed: List[str]):
    """Save all results to files."""
    print(f"\n💾 Saving results...")
    
    # Save successful realistic paths
    with open('all_realistic_optimal_paths.json', 'w') as f:
        json.dump(optimal_paths, f, indent=2)
    print(f"✅ Saved {len(optimal_paths)} realistic optimal paths to all_realistic_optimal_paths.json")
    
    # Save unreachable cosmologies
    if unreachable:
        with open('unreachable_realistic_cosmologies.json', 'w') as f:
            json.dump(unreachable, f, indent=2)
        print(f"⚠️  Saved {len(unreachable)} unreachable cosmologies to unreachable_realistic_cosmologies.json")
    
    # Save failed cosmologies
    if failed:
        with open('failed_realistic_cosmologies.json', 'w') as f:
            json.dump(failed, f, indent=2)
        print(f"❌ Saved {len(failed)} failed cosmologies to failed_realistic_cosmologies.json")

def generate_comprehensive_report(optimal_paths: Dict, unreachable: List[Dict], failed: List[str]):
    """Generate comprehensive report of all results."""
    lines = []
    lines.append("# 🎯 All Realistic Cosmology Paths Report")
    lines.append("")
    lines.append("This report shows realistic optimal paths for all cosmologies using the actual quiz engine simulation.")
    lines.append("")
    
    # Summary stats
    total = len(optimal_paths) + len(unreachable) + len(failed)
    lines.append("## 📊 Complete Summary Statistics")
    lines.append("")
    lines.append(f"- **Total cosmologies**: {total}")
    lines.append(f"- **Reachable in top 5**: {len(optimal_paths)} ({len(optimal_paths)/total*100:.1f}%)")
    lines.append(f"- **Unreachable (rank 6+)**: {len(unreachable)} ({len(unreachable)/total*100:.1f}%)")
    lines.append(f"- **Failed to simulate**: {len(failed)} ({len(failed)/total*100:.1f}%)")
    
    if optimal_paths:
        rank_1_count = sum(1 for p in optimal_paths.values() if p['best_rank'] == 1)
        top_5_count = len(optimal_paths)
        avg_rank = sum(p['best_rank'] for p in optimal_paths.values()) / len(optimal_paths)
        lines.append(f"- **Achievable as #1**: {rank_1_count} ({rank_1_count/len(optimal_paths)*100:.1f}%)")
        lines.append(f"- **Average rank (reachable)**: {avg_rank:.1f}")
    
    lines.append("")
    
    # Strategy analysis for reachable cosmologies
    if optimal_paths:
        strategy_counts = defaultdict(int)
        for path in optimal_paths.values():
            strategy_counts[path['strategy_used']] += 1
        
        lines.append("## 🧠 Strategy Analysis (Reachable Cosmologies)")
        lines.append("")
        for strategy, count in sorted(strategy_counts.items(), key=lambda x: x[1], reverse=True):
            pct = count / len(optimal_paths) * 100
            lines.append(f"- **{strategy}**: {count} cosmologies ({pct:.1f}%)")
        lines.append("")
    
    # Rank 1 cosmologies
    rank_1_cosmologies = [(name, data) for name, data in optimal_paths.items() if data['best_rank'] == 1]
    if rank_1_cosmologies:
        lines.append("## 🏆 Cosmologies Achievable as #1")
        lines.append("")
        rank_1_cosmologies.sort(key=lambda x: x[1]['best_score'], reverse=True)
        
        for name, data in rank_1_cosmologies[:10]:  # Show top 10
            lines.append(f"### {name}")
            lines.append(f"- **Category**: {data['category']}")
            lines.append(f"- **Score**: {data['best_score']:.1f}")
            lines.append(f"- **Strategy**: {data['strategy_used']}")
            lines.append(f"- **First Question**: {data['questions_asked'][0] if data['questions_asked'] else 'None'}")
            lines.append(f"- **Answer Sequence**: {' → '.join(data['answers_given'][:10])}{'...' if len(data['answers_given']) > 10 else ''}")
            lines.append("")
        
        if len(rank_1_cosmologies) > 10:
            lines.append(f"*...and {len(rank_1_cosmologies) - 10} more cosmologies achievable as #1*")
            lines.append("")
    
    # Unreachable cosmologies
    if unreachable:
        lines.append("## ⚠️ Unreachable Cosmologies (Not in Top 5)")
        lines.append("")
        lines.append("These cosmologies could not reach the top 5 despite multiple attempts:")
        lines.append("")
        
        # Group by category
        by_category = defaultdict(list)
        for cosmo in unreachable:
            by_category[cosmo['category']].append(cosmo)
        
        for category in sorted(by_category.keys()):
            cosmologies = by_category[category]
            lines.append(f"### {category}")
            for cosmo in cosmologies:
                lines.append(f"- **{cosmo['cosmology']}** (best rank: #{cosmo['best_rank']}, score: {cosmo['best_score']:.1f})")
            lines.append("")
    
    # Failed cosmologies
    if failed:
        lines.append("## ❌ Failed Simulations")
        lines.append("")
        lines.append("These cosmologies failed to simulate properly:")
        lines.append("")
        for cosmology in sorted(failed):
            lines.append(f"- {cosmology}")
        lines.append("")
    
    # Insights
    lines.append("## 🔍 Key Insights")
    lines.append("")
    
    if optimal_paths:
        # Question frequency analysis
        question_frequency = defaultdict(int)
        for path in optimal_paths.values():
            for question in path['questions_asked']:
                question_frequency[question] += 1
        
        most_common = sorted(question_frequency.items(), key=lambda x: x[1], reverse=True)[:5]
        lines.append("### Most Common First Questions")
        for question, count in most_common:
            if question == most_common[0][0]:  # First question
                lines.append(f"- **{question}**: Used in {count} optimal paths")
        lines.append("")
        
        # Average questions needed
        avg_questions = sum(p['total_questions'] for p in optimal_paths.values()) / len(optimal_paths)
        lines.append(f"### Efficiency")
        lines.append(f"- **Average questions needed**: {avg_questions:.1f}")
        lines.append("")
    
    # Save report
    with open('all_realistic_paths_report.md', 'w') as f:
        f.write('\n'.join(lines))
    
    print("✅ Saved comprehensive report to all_realistic_paths_report.md")

if __name__ == "__main__":
    main()