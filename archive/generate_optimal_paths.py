#!/usr/bin/env python3
"""
Optimal Cosmology Path Generator

This script finds the optimal answer path to reach each cosmology with the highest possible ranking.
It tests multiple strategies and saves the best path for each cosmology.
"""

import json
import random
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass
from collections import defaultdict
import copy

@dataclass
class OptimalPath:
    """Optimal path to reach a specific cosmology."""
    cosmology_name: str
    category: str
    best_rank: int
    best_score: float
    answer_path: List[str]
    question_path: List[str] 
    strategy_used: str
    attempts_tested: int

class EnhancedQuizSimulator:
    """Enhanced quiz simulator with full uncertainty scoring support."""
    
    def __init__(self, cosmologies_data: List[Dict], questions_data: Dict):
        self.cosmologies = cosmologies_data
        self.questions = questions_data
        self.question_keys = [k for k in cosmologies_data[0].keys() 
                             if k not in ['Order', 'Category', 'Cosmology']]
        
        # Scoring constants (matching the updated TypeScript)
        self.SCORE_ELIMINATE = -1000
        self.INITIAL_SCORE = 50
        
        # Ultra-skeptical cosmologies (get +5 for uncertainty)
        self.ultra_skeptical = {
            'Open Skeptic', 'Mystical Agnosticism', 
            'Epistemological Agnosticism', 'Perpetual Inquiry'
        }
        
        # Core skeptical cosmologies (get +4 for uncertainty)  
        self.core_skeptical = {
            'Transitional Seeking', 'Philosophical Spirituality', 'Pragmatic Spirituality'
        }
        
        print(f"Enhanced simulator: {len(self.cosmologies)} cosmologies, {len(self.question_keys)} questions")
    
    def simulate_quiz(self, answer_sequence: List[Tuple[str, str]], verbose: bool = False) -> List[Dict]:
        """Simulate quiz with enhanced uncertainty scoring."""
        scores = [self.INITIAL_SCORE for _ in self.cosmologies]
        asked_questions = set()
        
        if verbose:
            print(f"\nSimulating quiz with {len(answer_sequence)} answers...")
        
        for question_key, answer in answer_sequence:
            if question_key not in self.question_keys or question_key in asked_questions:
                continue
                
            asked_questions.add(question_key)
            
            for i, cosmology in enumerate(self.cosmologies):
                relation = cosmology.get(question_key, '')
                cosmology_name = cosmology['Cosmology']
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
                        else:
                            scores[i] -= 10  # Continue losing points
                            
                elif answer == 'N':
                    if relation == 'R':
                        if not is_eliminated:
                            scores[i] = self.SCORE_ELIMINATE
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
                            
                elif answer == '?':
                    # Enhanced uncertainty scoring
                    if cosmology_name in self.ultra_skeptical:
                        if not is_eliminated:
                            scores[i] += 5
                    elif cosmology_name in self.core_skeptical:
                        if not is_eliminated:
                            scores[i] += 4
                    elif cosmology.get('Comfortable with uncertainty') == 'R':
                        if not is_eliminated:
                            scores[i] += 2
                    elif relation == 'R':
                        # Penalty for requiring certainty (applies even to eliminated)
                        scores[i] -= 2
            
            if verbose:
                active_count = sum(1 for s in scores if s > self.SCORE_ELIMINATE)
                print(f"  {question_key} ({answer}): {active_count} active cosmologies")
        
        # Create results from ALL cosmologies (including eliminated ones)
        results = []
        for i, cosmology in enumerate(self.cosmologies):
            results.append({
                'name': cosmology['Cosmology'],
                'category': cosmology['Category'],
                'score': scores[i],
                'rank': 0  # Will be set after sorting
            })
        
        # Sort by score (highest first) and assign ranks
        results.sort(key=lambda x: x['score'], reverse=True)
        for i, result in enumerate(results):
            result['rank'] = i + 1
            
        if verbose:
            print(f"Top 5 results:")
            for i, result in enumerate(results[:5]):
                print(f"  {i+1}. {result['name']}: {result['score']}")
        
        return results

class OptimalPathFinder:
    """Finds optimal paths to reach each cosmology with highest ranking."""
    
    def __init__(self, simulator: EnhancedQuizSimulator):
        self.simulator = simulator
        self.cosmologies = simulator.cosmologies
        self.question_keys = simulator.question_keys
        
    def generate_direct_path(self, target_cosmology: str, max_questions: int = 20) -> Tuple[List[Tuple[str, str]], str]:
        """Direct strategy: Answer to maximize target's score."""
        target_data = None
        for cosmo in self.cosmologies:
            if cosmo['Cosmology'] == target_cosmology:
                target_data = cosmo
                break
        
        if not target_data:
            return [], "direct"
        
        path = []
        
        # Priority 1: Required questions (answer Y)
        required_qs = [q for q in self.question_keys if target_data.get(q) == 'R']
        for q in required_qs[:max_questions//2]:
            path.append((q, 'Y'))
        
        # Priority 2: Deal-breaker questions (answer N)
        db_qs = [q for q in self.question_keys if target_data.get(q) == 'DB']
        for q in db_qs[:max_questions//4]:
            path.append((q, 'N'))
        
        # Priority 3: Neutral questions (answer Y for slight boost)
        nr_qs = [q for q in self.question_keys if target_data.get(q) == 'NR']
        for q in nr_qs[:max_questions//4]:
            path.append((q, 'Y'))
        
        return path[:max_questions], "direct"
    
    def generate_uncertainty_path(self, target_cosmology: str, max_questions: int = 25) -> Tuple[List[Tuple[str, str]], str]:
        """Uncertainty strategy: Use 'I don't know' for skeptical cosmologies."""
        if target_cosmology in self.simulator.ultra_skeptical:
            # Ultra-skeptical path: mostly uncertainty
            path = [(q, '?') for q in self.question_keys[:max_questions]]
            return path, "ultra_uncertainty"
        elif target_cosmology in self.simulator.core_skeptical:
            # Core skeptical path: mix uncertainty with some targeted answers
            path = []
            target_data = None
            for cosmo in self.cosmologies:
                if cosmo['Cosmology'] == target_cosmology:
                    target_data = cosmo
                    break
            
            if target_data:
                # Some uncertainty + key required answers
                uncertainty_qs = self.question_keys[:max_questions//2]
                for q in uncertainty_qs:
                    path.append((q, '?'))
                
                required_qs = [q for q in self.question_keys if target_data.get(q) == 'R']
                for q in required_qs[:max_questions//2]:
                    if q not in [p[0] for p in path]:
                        path.append((q, 'Y'))
            
            return path[:max_questions], "core_uncertainty"
        else:
            return [], "uncertainty"
    
    def generate_elimination_path(self, target_cosmology: str, max_questions: int = 15) -> Tuple[List[Tuple[str, str]], str]:
        """Elimination strategy: Remove top competitors."""
        # Find cosmologies that often rank highly and eliminate them
        target_data = None
        for cosmo in self.cosmologies:
            if cosmo['Cosmology'] == target_cosmology:
                target_data = cosmo
                break
        
        if not target_data:
            return [], "elimination"
        
        path = []
        
        # Find questions where answering Y would eliminate many competitors
        elimination_candidates = []
        for q in self.question_keys:
            target_relation = target_data.get(q, '')
            if target_relation in ['R', 'NR']:  # Safe for target
                # Count how many others would be eliminated by Y
                eliminated_by_y = sum(1 for c in self.cosmologies 
                                    if c.get(q) == 'DB' and c['Cosmology'] != target_cosmology)
                if eliminated_by_y > 3:  # Good elimination potential
                    elimination_candidates.append((q, 'Y', eliminated_by_y))
        
        # Sort by elimination potential
        elimination_candidates.sort(key=lambda x: x[2], reverse=True)
        
        # Add elimination questions
        for q, answer, _ in elimination_candidates[:max_questions//2]:
            path.append((q, answer))
        
        # Add some target-specific questions
        required_qs = [q for q in self.question_keys if target_data.get(q) == 'R']
        for q in required_qs[:max_questions//2]:
            if q not in [p[0] for p in path]:
                path.append((q, 'Y'))
        
        return path[:max_questions], "elimination"
    
    def generate_random_path(self, length: int = 12) -> Tuple[List[Tuple[str, str]], str]:
        """Random strategy for baseline."""
        selected_questions = random.sample(self.question_keys, min(length, len(self.question_keys)))
        answers = ['Y', 'N', '?']
        path = [(q, random.choice(answers)) for q in selected_questions]
        return path, "random"
    
    def find_optimal_path(self, target_cosmology: str, max_attempts: int = 100) -> Optional[OptimalPath]:
        """Find the optimal path to reach target cosmology with highest ranking."""
        print(f"\nFinding optimal path for {target_cosmology}...")
        
        best_result = None
        strategies = [
            ("direct", self.generate_direct_path),
            ("uncertainty", self.generate_uncertainty_path), 
            ("elimination", self.generate_elimination_path),
            ("random", self.generate_random_path)
        ]
        
        attempts = 0
        
        for strategy_name, strategy_func in strategies:
            strategy_attempts = max_attempts // len(strategies)
            
            for attempt in range(strategy_attempts):
                attempts += 1
                
                try:
                    if strategy_name == "random":
                        path, strategy_used = strategy_func()
                    else:
                        path, strategy_used = strategy_func(target_cosmology)
                    
                    if not path:
                        continue
                    
                    # Simulate this path
                    results = self.simulator.simulate_quiz(path, verbose=False)
                    
                    # Find target cosmology in results
                    for result in results:
                        if result['name'] == target_cosmology:
                            rank = result['rank']
                            score = result['score']
                            
                            # Update best if this is better (lower rank = better)
                            if best_result is None or rank < best_result.best_rank:
                                # Get cosmology category
                                category = "Unknown"
                                for cosmo in self.cosmologies:
                                    if cosmo['Cosmology'] == target_cosmology:
                                        category = cosmo['Category']
                                        break
                                
                                best_result = OptimalPath(
                                    cosmology_name=target_cosmology,
                                    category=category,
                                    best_rank=rank,
                                    best_score=score,
                                    answer_path=[answer for _, answer in path],
                                    question_path=[question for question, _ in path],
                                    strategy_used=strategy_used,
                                    attempts_tested=attempts
                                )
                                
                                print(f"  New best: Rank #{rank}, Score {score:.1f} ({strategy_used}, attempt {attempts})")
                                
                                # If we got rank 1, we found the optimal
                                if rank == 1:
                                    return best_result
                            break
                
                except Exception as e:
                    print(f"  Error in attempt {attempts}: {e}")
                    continue
        
        if best_result:
            print(f"  Final best: Rank #{best_result.best_rank}, Score {best_result.best_score:.1f}")
        else:
            print(f"  ❌ Could not find any path for {target_cosmology}")
        
        return best_result

def main():
    """Generate optimal paths for all cosmologies."""
    print("=" * 70)
    print("OPTIMAL COSMOLOGY PATH GENERATOR")
    print("=" * 70)
    
    # Load data
    print("Loading data...")
    with open('public/data/cosmology_features.json', 'r') as f:
        cosmologies_data = json.load(f)
    
    with open('public/data/question_library_v3.json', 'r') as f:
        questions_data = json.load(f)
    
    print(f"Loaded {len(cosmologies_data)} cosmologies and {len(questions_data)} questions")
    
    # Initialize enhanced simulator and path finder
    simulator = EnhancedQuizSimulator(cosmologies_data, questions_data)
    path_finder = OptimalPathFinder(simulator)
    
    # Find optimal paths for all cosmologies
    optimal_paths = {}
    failed_cosmologies = []
    
    print("\nFinding optimal paths for all cosmologies...")
    print("=" * 50)
    
    for i, cosmology in enumerate(cosmologies_data):
        cosmology_name = cosmology['Cosmology']
        
        try:
            optimal_path = path_finder.find_optimal_path(cosmology_name, max_attempts=80)
            
            if optimal_path:
                optimal_paths[cosmology_name] = {
                    "category": optimal_path.category,
                    "best_rank": optimal_path.best_rank,
                    "best_score": optimal_path.best_score,
                    "strategy_used": optimal_path.strategy_used,
                    "attempts_tested": optimal_path.attempts_tested,
                    "answer_sequence": optimal_path.answer_path,
                    "questions_used": optimal_path.question_path,
                    "path_summary": f"{len(optimal_path.question_path)} questions using {optimal_path.strategy_used} strategy"
                }
            else:
                failed_cosmologies.append(cosmology_name)
            
            # Progress indicator
            progress = f"({i+1}/{len(cosmologies_data)})"
            status = "✅" if optimal_path else "❌"
            rank_info = f" -> #{optimal_path.best_rank}" if optimal_path else ""
            print(f"{progress} {status} {cosmology_name}{rank_info}")
            
        except Exception as e:
            print(f"({i+1}/{len(cosmologies_data)}) ❌ {cosmology_name} - Error: {e}")
            failed_cosmologies.append(cosmology_name)
    
    # Save results
    save_optimal_paths(optimal_paths, failed_cosmologies)
    generate_summary_report(optimal_paths, failed_cosmologies)
    
    print("\n" + "=" * 70)
    print("GENERATION COMPLETE!")
    print("=" * 70)

def save_optimal_paths(optimal_paths: Dict, failed_cosmologies: List[str]):
    """Save optimal paths to JSON file."""
    print(f"\nSaving {len(optimal_paths)} optimal paths...")
    
    with open('optimal_cosmology_paths.json', 'w') as f:
        json.dump(optimal_paths, f, indent=2)
    
    print(f"✅ Saved optimal paths to optimal_cosmology_paths.json")
    
    if failed_cosmologies:
        with open('failed_cosmologies.json', 'w') as f:
            json.dump(failed_cosmologies, f, indent=2)
        print(f"❌ Saved {len(failed_cosmologies)} failed cosmologies to failed_cosmologies.json")

def generate_summary_report(optimal_paths: Dict, failed_cosmologies: List[str]):
    """Generate human-readable summary report."""
    lines = []
    lines.append("# 🎯 Optimal Cosmology Paths Report")
    lines.append("")
    lines.append("This report shows the optimal answer path to reach each cosmology with the highest possible ranking.")
    lines.append("")
    
    # Summary stats
    total = len(optimal_paths) + len(failed_cosmologies)
    lines.append("## 📊 Summary Statistics")
    lines.append("")
    lines.append(f"- **Total cosmologies**: {total}")
    lines.append(f"- **Optimal paths found**: {len(optimal_paths)} ({len(optimal_paths)/total*100:.1f}%)")
    lines.append(f"- **Failed to optimize**: {len(failed_cosmologies)} ({len(failed_cosmologies)/total*100:.1f}%)")
    
    if optimal_paths:
        rank_1_count = sum(1 for p in optimal_paths.values() if p['best_rank'] == 1)
        top_5_count = sum(1 for p in optimal_paths.values() if p['best_rank'] <= 5)
        avg_rank = sum(p['best_rank'] for p in optimal_paths.values()) / len(optimal_paths)
        lines.append(f"- **Achievable as #1**: {rank_1_count} ({rank_1_count/len(optimal_paths)*100:.1f}%)")
        lines.append(f"- **Achievable in top 5**: {top_5_count} ({top_5_count/len(optimal_paths)*100:.1f}%)")
        lines.append(f"- **Average best rank**: {avg_rank:.1f}")
    
    lines.append("")
    
    # Strategy analysis
    if optimal_paths:
        strategy_counts = defaultdict(int)
        for path in optimal_paths.values():
            strategy_counts[path['strategy_used']] += 1
        
        lines.append("## 🧠 Strategy Analysis")
        lines.append("")
        for strategy, count in sorted(strategy_counts.items(), key=lambda x: x[1], reverse=True):
            pct = count / len(optimal_paths) * 100
            lines.append(f"- **{strategy}**: {count} cosmologies ({pct:.1f}%)")
        lines.append("")
    
    # Top performers (rank 1)
    rank_1_cosmologies = [(name, data) for name, data in optimal_paths.items() if data['best_rank'] == 1]
    if rank_1_cosmologies:
        lines.append("## 🏆 Cosmologies Achievable as #1")
        lines.append("")
        rank_1_cosmologies.sort(key=lambda x: x[1]['best_score'], reverse=True)
        
        for name, data in rank_1_cosmologies:
            lines.append(f"### {name}")
            lines.append(f"- **Category**: {data['category']}")
            lines.append(f"- **Best Score**: {data['best_score']:.1f}")
            lines.append(f"- **Strategy**: {data['strategy_used']}")
            lines.append(f"- **Path**: {data['path_summary']}")
            lines.append(f"- **Answer Sequence**: {' → '.join(data['answer_sequence'])}")
            lines.append(f"- **Questions**: {', '.join(data['questions_used'][:5])}{'...' if len(data['questions_used']) > 5 else ''}")
            lines.append("")
    
    # By category analysis
    lines.append("## 📚 Results by Category")
    lines.append("")
    by_category = defaultdict(list)
    for name, data in optimal_paths.items():
        by_category[data['category']].append((name, data))
    
    for category in sorted(by_category.keys()):
        cosmologies = by_category[category]
        lines.append(f"### {category}")
        
        avg_rank = sum(data['best_rank'] for _, data in cosmologies) / len(cosmologies)
        rank_1_count = sum(1 for _, data in cosmologies if data['best_rank'] == 1)
        lines.append(f"- **Count**: {len(cosmologies)}")
        lines.append(f"- **Average rank**: {avg_rank:.1f}")
        lines.append(f"- **Achievable as #1**: {rank_1_count}")
        lines.append("")
    
    # Failed cosmologies
    if failed_cosmologies:
        lines.append("## ❌ Failed to Optimize")
        lines.append("")
        lines.append("These cosmologies could not be optimized with the current strategies:")
        lines.append("")
        for cosmology in sorted(failed_cosmologies):
            lines.append(f"- {cosmology}")
        lines.append("")
    
    # Save report
    with open('optimal_paths_report.md', 'w') as f:
        f.write('\n'.join(lines))
    
    print("✅ Saved detailed report to optimal_paths_report.md")

if __name__ == "__main__":
    main()