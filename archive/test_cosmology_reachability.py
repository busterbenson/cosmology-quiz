#!/usr/bin/env python3
"""
Automated Cosmology Reachability Test

This script tests whether every cosmology in the quiz can be reached
and appear in the top 5 results through at least one question path.
"""

import json
import random
from typing import Dict, List, Tuple, Optional, Set
from dataclasses import dataclass
from collections import defaultdict
import copy

@dataclass
class TestResult:
    """Result of testing a single cosmology."""
    cosmology_name: str
    category: str
    reachable: bool
    best_rank: Optional[int] = None
    best_score: Optional[float] = None
    successful_path: Optional[List[str]] = None
    questions_used: Optional[List[str]] = None
    attempts: int = 0

class QuizSimulator:
    """Simulates the cosmology quiz scoring system."""
    
    def __init__(self, cosmologies_data: List[Dict], questions_data: Dict):
        self.cosmologies = cosmologies_data
        self.questions = questions_data
        self.question_keys = [k for k in cosmologies_data[0].keys() 
                             if k not in ['Order', 'Category', 'Cosmology']]
        
        # Scoring constants (from CONFIG in types/index.ts)
        self.SCORE_ELIMINATE = -1000
        self.INITIAL_SCORE = 50
        
        print(f"Initialized simulator with {len(self.cosmologies)} cosmologies and {len(self.question_keys)} questions")
    
    def simulate_quiz(self, answer_sequence: List[Tuple[str, str]], verbose: bool = False) -> List[Dict]:
        """
        Simulate a quiz with a given answer sequence.
        
        Args:
            answer_sequence: List of (question_key, answer) tuples
            verbose: Whether to print debug info
            
        Returns:
            List of cosmology results sorted by score (highest first)
        """
        # Initialize scores for all cosmologies
        scores = [self.INITIAL_SCORE for _ in self.cosmologies]
        asked_questions = set()
        
        if verbose:
            print(f"\nSimulating quiz with {len(answer_sequence)} answers...")
        
        for question_key, answer in answer_sequence:
            if question_key not in self.question_keys:
                if verbose:
                    print(f"Warning: Unknown question '{question_key}'")
                continue
                
            if question_key in asked_questions:
                if verbose:
                    print(f"Warning: Question '{question_key}' already asked")
                continue
                    
            asked_questions.add(question_key)
            
            # Process answer for each cosmology
            eliminated_count = 0
            for i, cosmology in enumerate(self.cosmologies):
                if scores[i] <= self.SCORE_ELIMINATE:
                    continue  # Already eliminated
                
                relation = cosmology.get(question_key, '')
                
                if answer == 'Y':
                    if relation == 'R':
                        scores[i] += 10
                    elif relation == 'NR':
                        scores[i] += 3
                    elif relation == 'DB':
                        scores[i] = self.SCORE_ELIMINATE
                        eliminated_count += 1
                elif answer == 'N':
                    if relation == 'R':
                        scores[i] = self.SCORE_ELIMINATE
                        eliminated_count += 1
                    elif relation == 'NR':
                        scores[i] += 3
                    elif relation == 'DB':
                        scores[i] += 10
                elif answer == '?':
                    # Handle uncertainty scoring (simplified)
                    if relation == 'R':
                        scores[i] -= 2  # Penalty for requiring certainty
                    # Could add uncertainty boost logic here
            
            if verbose:
                active_count = sum(1 for s in scores if s > self.SCORE_ELIMINATE)
                print(f"  {question_key} ({answer}): {active_count} active, {eliminated_count} eliminated")
        
        # Create results
        results = []
        for i, cosmology in enumerate(self.cosmologies):
            if scores[i] > self.SCORE_ELIMINATE:
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
            print(f"Final results: {len(results)} cosmologies remaining")
            for i, result in enumerate(results[:5]):
                print(f"  {i+1}. {result['name']}: {result['score']}")
        
        return results

class CosmologyPathFinder:
    """Finds answer paths that lead to specific cosmologies appearing in top 5."""
    
    def __init__(self, simulator: QuizSimulator):
        self.simulator = simulator
        self.cosmologies = simulator.cosmologies
        self.question_keys = simulator.question_keys
        
    def generate_targeted_path(self, target_cosmology: str, max_questions: int = 15) -> List[Tuple[str, str]]:
        """
        Generate a targeted answer sequence to promote a specific cosmology.
        
        Strategy:
        1. Answer Y to questions where target has R
        2. Answer N to questions where target has DB  
        3. Answer Y to questions where target has NR and competitors have DB
        """
        # Find the target cosmology data
        target_data = None
        for cosmo in self.cosmologies:
            if cosmo['Cosmology'] == target_cosmology:
                target_data = cosmo
                break
        
        if not target_data:
            return []
        
        # Categorize questions by target's relationship
        required_questions = []  # Target has R
        dealbreaker_questions = []  # Target has DB
        neutral_questions = []  # Target has NR
        
        for q_key in self.question_keys:
            relation = target_data.get(q_key, '')
            if relation == 'R':
                required_questions.append(q_key)
            elif relation == 'DB':
                dealbreaker_questions.append(q_key)
            elif relation == 'NR':
                neutral_questions.append(q_key)
        
        # Build answer sequence
        path = []
        
        # Answer Y to required questions (highest priority)
        for q_key in required_questions[:max_questions//2]:
            path.append((q_key, 'Y'))
        
        # Answer N to dealbreaker questions
        for q_key in dealbreaker_questions[:max_questions//4]:
            path.append((q_key, 'N'))
        
        # For neutral questions, choose strategically
        # Answer Y if it helps eliminate competitors
        for q_key in neutral_questions[:max_questions//4]:
            # Simple heuristic: answer Y to neutral questions
            path.append((q_key, 'Y'))
        
        return path[:max_questions]
    
    def generate_random_path(self, length: int = 12) -> List[Tuple[str, str]]:
        """Generate a random answer sequence."""
        selected_questions = random.sample(self.question_keys, min(length, len(self.question_keys)))
        answers = ['Y', 'N', '?']
        return [(q, random.choice(answers)) for q in selected_questions]
    
    def find_paths_for_cosmology(self, target_cosmology: str, max_attempts: int = 50) -> TestResult:
        """
        Find answer paths that lead to the target cosmology appearing in top 5.
        
        Uses multiple strategies and returns the best result found.
        """
        best_result = TestResult(
            cosmology_name=target_cosmology,
            category="Unknown",
            reachable=False,
            attempts=0
        )
        
        # Get category
        for cosmo in self.cosmologies:
            if cosmo['Cosmology'] == target_cosmology:
                best_result.category = cosmo['Category']
                break
        
        print(f"\nTesting {target_cosmology}...")
        
        for attempt in range(max_attempts):
            best_result.attempts += 1
            
            # Try different strategies
            if attempt < 20:
                # Targeted approach
                path = self.generate_targeted_path(target_cosmology)
            else:
                # Random approach
                path = self.generate_random_path()
            
            if not path:
                continue
                
            # Simulate this path
            results = self.simulator.simulate_quiz(path, verbose=False)
            
            # Check if target cosmology is in top 5
            for result in results[:5]:
                if result['name'] == target_cosmology:
                    rank = result['rank']
                    score = result['score']
                    
                    # Update best result if this is better
                    if not best_result.reachable or rank < best_result.best_rank:
                        best_result.reachable = True
                        best_result.best_rank = rank
                        best_result.best_score = score
                        best_result.successful_path = [answer for _, answer in path]
                        best_result.questions_used = [question for question, _ in path]
                        
                        print(f"  Found path! Rank {rank}, Score {score:.1f} (attempt {attempt+1})")
                        
                        # If we got rank 1, we can stop
                        if rank == 1:
                            return best_result
                    break
            
            # Print progress every 10 attempts
            if (attempt + 1) % 10 == 0:
                status = f"rank {best_result.best_rank}" if best_result.reachable else "not found"
                print(f"  Attempt {attempt+1}: best {status}")
        
        if not best_result.reachable:
            print(f"  ❌ Could not reach {target_cosmology} in top 5 after {max_attempts} attempts")
        
        return best_result

def main():
    """Run the cosmology reachability test."""
    print("=" * 70)
    print("COSMOLOGY REACHABILITY TEST")
    print("=" * 70)
    
    # Load data
    print("Loading data...")
    with open('public/data/cosmology_features.json', 'r') as f:
        cosmologies_data = json.load(f)
    
    with open('public/data/question_library_v3.json', 'r') as f:
        questions_data = json.load(f)
    
    print(f"Loaded {len(cosmologies_data)} cosmologies and {len(questions_data)} questions")
    
    # Initialize simulator and path finder
    simulator = QuizSimulator(cosmologies_data, questions_data)
    path_finder = CosmologyPathFinder(simulator)
    
    # Test each cosmology
    all_results = []
    reachable_count = 0
    
    print("\nTesting reachability for all cosmologies...")
    print("=" * 50)
    
    for i, cosmology in enumerate(cosmologies_data):
        cosmology_name = cosmology['Cosmology']
        result = path_finder.find_paths_for_cosmology(cosmology_name, max_attempts=30)
        all_results.append(result)
        
        if result.reachable:
            reachable_count += 1
        
        # Print progress
        progress = f"({i+1}/{len(cosmologies_data)})"
        status = "✅" if result.reachable else "❌"
        print(f"{progress} {status} {cosmology_name}")
    
    # Generate summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total cosmologies tested: {len(cosmologies_data)}")
    print(f"Reachable in top 5: {reachable_count}")
    print(f"Unreachable: {len(cosmologies_data) - reachable_count}")
    print(f"Success rate: {reachable_count/len(cosmologies_data)*100:.1f}%")
    
    # Save detailed results
    save_results(all_results)
    
    return all_results

def save_results(results: List[TestResult]):
    """Save test results to files."""
    print("\nSaving results...")
    
    # Save successful paths
    successful_paths = {}
    unreachable_cosmologies = []
    
    for result in results:
        if result.reachable:
            successful_paths[result.cosmology_name] = {
                "category": result.category,
                "best_rank": result.best_rank,
                "best_score": result.best_score,
                "path": result.successful_path,
                "questions": result.questions_used,
                "attempts_needed": result.attempts
            }
        else:
            unreachable_cosmologies.append({
                "cosmology": result.cosmology_name,
                "category": result.category,
                "attempts": result.attempts
            })
    
    # Save successful paths
    with open('successful_paths.json', 'w') as f:
        json.dump(successful_paths, f, indent=2)
    print(f"Saved {len(successful_paths)} successful paths to successful_paths.json")
    
    # Save unreachable cosmologies
    with open('unreachable_cosmologies.json', 'w') as f:
        json.dump(unreachable_cosmologies, f, indent=2)
    print(f"Saved {len(unreachable_cosmologies)} unreachable cosmologies to unreachable_cosmologies.json")
    
    # Generate markdown report
    generate_markdown_report(results)

def generate_markdown_report(results: List[TestResult]):
    """Generate a detailed markdown report."""
    report_lines = []
    report_lines.append("# Cosmology Reachability Test Report")
    report_lines.append("")
    
    # Summary statistics
    reachable = [r for r in results if r.reachable]
    unreachable = [r for r in results if not r.reachable]
    
    report_lines.append("## Summary Statistics")
    report_lines.append("")
    report_lines.append(f"- **Total cosmologies tested**: {len(results)}")
    report_lines.append(f"- **Reachable in top 5**: {len(reachable)} ({len(reachable)/len(results)*100:.1f}%)")
    report_lines.append(f"- **Unreachable**: {len(unreachable)} ({len(unreachable)/len(results)*100:.1f}%)")
    
    if reachable:
        avg_rank = sum(r.best_rank for r in reachable) / len(reachable)
        avg_questions = sum(len(r.questions_used) for r in reachable) / len(reachable)
        report_lines.append(f"- **Average rank of reachable**: {avg_rank:.1f}")
        report_lines.append(f"- **Average questions needed**: {avg_questions:.1f}")
    
    report_lines.append("")
    
    # Reachable cosmologies
    if reachable:
        report_lines.append("## ✅ Reachable Cosmologies")
        report_lines.append("")
        
        # Sort by rank
        reachable.sort(key=lambda x: x.best_rank)
        
        for result in reachable:
            report_lines.append(f"### {result.cosmology_name}")
            report_lines.append(f"- **Category**: {result.category}")
            report_lines.append(f"- **Best rank**: #{result.best_rank}")
            report_lines.append(f"- **Best score**: {result.best_score:.1f}")
            report_lines.append(f"- **Questions needed**: {len(result.questions_used)}")
            report_lines.append(f"- **Attempts needed**: {result.attempts}")
            
            if result.questions_used and result.successful_path:
                report_lines.append("- **Successful path**:")
                for q, a in zip(result.questions_used, result.successful_path):
                    report_lines.append(f"  - {q}: {a}")
            
            report_lines.append("")
    
    # Unreachable cosmologies
    if unreachable:
        report_lines.append("## ❌ Unreachable Cosmologies")
        report_lines.append("")
        
        # Group by category
        by_category = defaultdict(list)
        for result in unreachable:
            by_category[result.category].append(result)
        
        for category, cosmologies in sorted(by_category.items()):
            report_lines.append(f"### {category}")
            for result in cosmologies:
                report_lines.append(f"- **{result.cosmology_name}** (tested {result.attempts} paths)")
            report_lines.append("")
    
    # Save report
    with open('cosmology_reachability_report.md', 'w') as f:
        f.write('\n'.join(report_lines))
    
    print("Saved detailed report to cosmology_reachability_report.md")

if __name__ == "__main__":
    main()