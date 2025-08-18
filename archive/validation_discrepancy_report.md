# Validation Discrepancy Report

## Issue Summary

The user reported that the permalink `http://localhost:3000/results?answers=NNNNNNNNNYNN` does **not** show Classical Polytheism as the top result, contradicting our API validation results.

## Validation Results

### Our API Claims (from authentic_profiles_results.json)
- **Classical Polytheism**: Rank #1, Score 88
- Answer string: `NNNNNNNNNYNN`
- Permalink: `http://localhost:3000/results?answers=NNNNNNNNNYNN`

### Auto-Quiz API Test Results
```bash
curl -s -X POST "http://localhost:3000/api/auto-quiz" \
  -H "Content-Type: application/json" \
  -d '{"answerProfile": {...}}'
```
**Actual Results:**
1. Universal Mind: 70
2. Classical Pantheism: 62  
3. Neutral Monism: 62
4. Monistic Pantheism: 54
5. Panpsychism: 46

**Classical Polytheism**: Not in top 5

### User Browser Observation
- User visits: `http://localhost:3000/results?answers=NNNNNNNNNYNN`
- **Does NOT see Classical Polytheism**
- This confirms our API testing above

## Root Cause Analysis

### Problem 1: Inconsistent Simulation Logic
Our server-side API endpoints (`/api/auto-quiz`, `/api/test-permalink`) attempt to replicate the quiz engine logic but fail to match the actual frontend implementation.

### Problem 2: Missing Frontend Logic
The real quiz engine in `useQuizEngine.ts` has:
- Complex entropy-based question selection
- Conviction profile processing  
- Concept boosts and eliminations
- Post-elimination scoring
- Sophisticated stopping conditions

Our server simulations are oversimplified and miss these critical features.

### Problem 3: Wrong Validation Method
We should be using the actual `runAutoQuiz` method from the frontend composable, not trying to replicate the logic in separate APIs.

## Evidence

1. **Simplified simulation test** (validate_real_engine.js):
   - Classical Polytheism: Rank #26, Score 20
   - Top result: Progressive Creation

2. **Auto-quiz API test**:
   - Universal Mind as #1
   - Classical Polytheism not in top 5

3. **User browser observation**:
   - Confirms Classical Polytheism is NOT the top result

## Conclusion

Our authentic profile generator and validation are using incorrect APIs that don't match the real frontend quiz engine behavior. The discrepancy is real and significant.

## Recommended Fix

1. Stop using server-side API simulations for validation
2. Use the actual `runAutoQuiz` method from `useQuizEngine.ts` 
3. Create a proper validation tool that imports and uses the real composable logic
4. Re-test all authentic profiles using the correct method

## Impact

All results in `authentic_profiles_results.json` are suspect and need to be regenerated using the correct validation method.