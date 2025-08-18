#!/usr/bin/env python3
"""
Real Quiz Simulator

This simulator drives the actual TypeScript quiz engine running in the browser
to get the true behavior without reimplementation.
"""

import json
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options

class RealQuizSimulator:
    """Drives the actual TypeScript quiz engine in the browser."""
    
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
        self.driver = None
    
    def setup_browser(self):
        """Setup headless Chrome browser."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        return self.driver is not None
    
    def simulate_quiz_with_answers(self, answers, verbose=False):
        """
        Drive the real quiz engine with a sequence of answers.
        
        Args:
            answers: List of answer strings ('Y', 'N', '?')
            verbose: Whether to print detailed progress
        
        Returns:
            Dict with questions asked, final results, etc.
        """
        if not self.driver:
            if not self.setup_browser():
                raise Exception("Failed to setup browser")
        
        if verbose:
            print(f"🎯 DRIVING REAL QUIZ WITH {len(answers)} ANSWERS")
            print("=" * 60)
        
        # Navigate to quiz start
        self.driver.get(f"{self.base_url}/quiz")
        
        # Wait for quiz to initialize
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".cosmic-card"))
        )
        
        questions_asked = []
        answers_given = []
        
        for i, answer in enumerate(answers):
            if verbose:
                print(f"\n📍 QUESTION {i+1}: Answering {answer}")
            
            # Wait for question to appear
            try:
                question_element = WebDriverWait(self.driver, 5).until(
                    EC.presence_of_element_located((By.TAG_NAME, "h3"))
                )
                question_text = question_element.text
                questions_asked.append(question_text)
                
                if verbose:
                    print(f"   Question: {question_text}")
                
                # Find and click the appropriate button
                button_text = {
                    'Y': 'Yes',
                    'N': 'No', 
                    '?': "Don't Know"
                }[answer]
                
                button = self.driver.find_element(By.XPATH, f"//button[contains(text(), '{button_text}')]")
                button.click()
                answers_given.append(answer)
                
                # Wait a moment for processing
                time.sleep(0.5)
                
            except Exception as e:
                if verbose:
                    print(f"   🛑 Quiz completed or error: {e}")
                break
        
        # Check if we're on results page or quiz is complete
        try:
            # Look for completion indicator
            completion_element = self.driver.find_element(By.XPATH, "//h2[contains(text(), 'Quiz Complete')]")
            if verbose:
                print(f"\n✅ Quiz completed after {len(answers_given)} questions")
        except:
            # Check if there's a "View Results" button
            try:
                view_results_btn = self.driver.find_element(By.XPATH, "//button[contains(text(), 'View Results')]")
                view_results_btn.click()
                if verbose:
                    print(f"\n✅ Clicked View Results after {len(answers_given)} questions")
            except:
                if verbose:
                    print(f"\n⚠️ Unclear completion state after {len(answers_given)} questions")
        
        # Navigate to results to get final state
        self.driver.get(f"{self.base_url}/results")
        
        # Wait for results to load and extract them
        time.sleep(2)
        
        try:
            # Extract top results from the page
            result_elements = self.driver.find_elements(By.CSS_SELECTOR, ".result-item, .cosmic-card")
            final_results = []
            
            # Try to extract results from the page
            page_text = self.driver.page_source
            if verbose:
                print(f"\n📊 FINAL RESULTS EXTRACTED")
                
        except Exception as e:
            if verbose:
                print(f"   Error extracting results: {e}")
            final_results = []
        
        return {
            'questions_asked': questions_asked,
            'answers_given': answers_given,
            'total_questions': len(answers_given),
            'final_results': final_results,
            'completed_normally': len(answers_given) < len(answers)
        }
    
    def test_permalink_answers(self, permalink_answers, verbose=False):
        """Test the specific permalink answers that caused the discrepancy."""
        
        # Decode the permalink answers
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
        
        if verbose:
            print(f"🔍 TESTING PERMALINK: {permalink_answers}")
            print(f"📝 DECODED ANSWERS: {decoded_answers}")
            print()
        
        return self.simulate_quiz_with_answers(decoded_answers, verbose)
    
    def cleanup(self):
        """Clean up browser resources."""
        if self.driver:
            self.driver.quit()
            self.driver = None

def main():
    """Test the real quiz simulator with the problematic permalink."""
    
    # The exact permalink that showed the discrepancy
    permalink_answers = "NNNYNNNNNYNNYYYYNNYYYNYYYYY"
    
    print(f"🎯 REAL QUIZ SIMULATION TEST")
    print(f"Permalink: {permalink_answers}")
    print(f"Length: {len(permalink_answers)} answers")
    print("=" * 80)
    
    simulator = RealQuizSimulator()
    
    try:
        result = simulator.test_permalink_answers(permalink_answers, verbose=True)
        
        print(f"\n" + "=" * 80)
        print(f"🎯 REAL QUIZ RESULTS:")
        print(f"Questions processed: {result['total_questions']}")
        print(f"Completed normally: {result['completed_normally']}")
        print(f"Questions asked: {len(result['questions_asked'])}")
        if result['questions_asked']:
            print(f"First question: {result['questions_asked'][0]}")
            print(f"Last question: {result['questions_asked'][-1]}")
        print(f"Answers given: {''.join(result['answers_given'])}")
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        print("Make sure the dev server is running on localhost:3000")
        print("Run: npm run dev")
        
    finally:
        simulator.cleanup()

if __name__ == "__main__":
    main()