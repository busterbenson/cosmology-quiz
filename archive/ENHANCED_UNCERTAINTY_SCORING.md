# Enhanced Uncertainty Scoring Update

## Changes Made

Updated the uncertainty scoring system to better differentiate between levels of skepticism:

### New Scoring Tiers for "I Don't Know" Answers:

1. **Ultra-Skeptical Cosmologies** (+5 points each):
   - **Open Skeptic** 
   - **Mystical Agnosticism**

2. **Core Skeptical Cosmologies** (+4 points each):
   - Epistemological Agnosticism
   - Perpetual Inquiry  
   - Transitional Seeking
   - Philosophical Spirituality
   - Pragmatic Spirituality

3. **Uncertainty-Friendly Cosmologies** (+2 points each):
   - All cosmologies with "Comfortable with uncertainty" = "R"

4. **Certainty-Requiring Cosmologies** (-2 points each):
   - Cosmologies with "R" relation to the specific question

## Impact

With this change, when someone answers "I don't know" to many questions:

### Before:
- All skeptical cosmologies tied at 150 points (4 × 20 + 50 base)
- No clear preference for most uncertainty-embracing worldviews

### After:
- **Open Skeptic & Mystical Agnosticism**: 175 points (5 × 25 + 50 base) 
- **Other skeptical cosmologies**: 170 points (4 × 25 + 50 base)
- **Clear ranking** that reflects degrees of epistemic humility

## Philosophy Behind the Change

**Open Skeptic** and **Mystical Agnosticism** represent the most fundamentally uncertainty-embracing worldviews:

- **Open Skeptic**: Questions everything, comfortable with not knowing
- **Mystical Agnosticism**: Combines mystical openness with epistemological humility

These deserve the highest uncertainty rewards as they most authentically represent the mindset of someone who frequently answers "I don't know."

## Technical Implementation

Updated `composables/useQuestionScoring.ts`:
- Split skeptical cosmologies into two tiers
- Ultra-skeptical get 5 points vs 4 for core skeptical
- Maintains all other scoring relationships

This ensures the quiz accurately reflects the full spectrum of epistemic attitudes toward uncertainty.