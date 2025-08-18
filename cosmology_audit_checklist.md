# Cosmology Audit Checklist

## Legend
- ✅ **Audited & Complete** - Has exactly 20 R+DB assignments, properly calibrated
- 🚨 **Critical Priority** - Severely under-specified (≤5 total assignments)
- ⚠️ **High Priority** - Under-specified (6-10 total assignments)
- 📝 **Medium Priority** - Sparse (11-15 total assignments)

## Current Status Summary

Based on systematic audit (node systematic_audit.js):

### Summary Statistics
- **Total Cosmologies**: 113
- **Fully Audited**: 80 (70.8%)
- **Need Expansion**: 33 (29.2%) 
- **Critical Priority**: 16 cosmologies (≤5 assignments)
- **High Priority**: 7 cosmologies (6-10 assignments)
- **Medium Priority**: 10 cosmologies (11-15 assignments)

## Critical Priority Cosmologies (≤5 assignments) - 16 total

### Agnostic Spiritual Seeker (6 cosmologies)
1. **Mystical Agnosticism** - 5 assignments (5R + 0DB) - ❌ Logical inconsistency: claiming certainty about ultimate reality
2. **Pragmatic Spirituality** - 4 assignments (4R + 0DB) 
3. **Philosophical Spirituality** - 3 assignments (3R + 0DB)
4. **Transitional Seeking** - 3 assignments (3R + 0DB)
5. **Epistemological Agnosticism** - 4 assignments (4R + 0DB) - ❌ Logical inconsistency: claiming certainty about ultimate reality
6. **Perpetual Inquiry** - 3 assignments (3R + 0DB)

### Ancient Astronaut Theory (4 cosmologies)
7. **Intervention Origins** - 2 assignments (1R + 1DB)
8. **Technological Guidance** - 3 assignments (1R + 2DB)
9. **Religious Foundations** - 3 assignments (1R + 2DB)
10. **Ongoing Presence** - 3 assignments (2R + 1DB)

### Unconventional Skeptic (4 cosmologies)
11. **Hidden History Researcher** - 3 assignments (3R + 0DB) - ❌ Missing core skeptic beliefs
12. **Alternative Physics Explorer** - 2 assignments (2R + 0DB) - ❌ Missing core skeptic beliefs
13. **Conspiracy Analyst** - 3 assignments (3R + 0DB) - ❌ Missing core skeptic beliefs
14. **Open Skeptic** - 2 assignments (2R + 0DB) - ❌ Missing core skeptic beliefs

### Simulation Hypothesis (2 cosmologies)
15. **Nested Realities** - 5 assignments (2R + 3DB)
16. **Conscious Simulation** - 4 assignments (4R + 0DB)

## High Priority Cosmologies (6-10 assignments) - 7 total

1. **Panpsychism** (Animism) - 8 assignments (1R + 7DB)
2. **Technological Simulation** (Simulation Hypothesis) - 6 assignments (2R + 4DB)
3. **Divine Simulation** (Simulation Hypothesis) - 6 assignments (3R + 3DB)
4. **Kinship Cosmology** (Indigenous Relational Worldview) - 6 assignments (3R + 3DB)
5. **Ancestral Continuity** (Indigenous Relational Worldview) - 6 assignments (3R + 3DB)
6. **Entropic Gravity** (Information-Theoretic Cosmology) - 8 assignments (5R + 3DB)
7. **Eclectic Synthesis** (New Age Spiritualism) - 7 assignments (6R + 1DB)

## Medium Priority Cosmologies (11-15 assignments) - 10 total

1. **Traditional Animism** (Animism) - 14 assignments (5R + 9DB)
2. **Neo-Animism** (Animism) - 11 assignments (4R + 7DB)
3. **Classical Pantheism** (Pantheism) - 14 assignments (3R + 11DB)
4. **Analytical Idealism** (Consciousness-First) - 15 assignments (5R + 10DB)
5. **Transcendental Idealism** (Consciousness-First) - 14 assignments (4R + 10DB) - ❌ Needs 5+ R beliefs
6. **Quantum Many-Worlds** (Multiverse Theory) - 14 assignments (9R + 5DB)
7. **Cosmic Bubble Universes** (Multiverse Theory) - 15 assignments (10R + 5DB)
8. **Higher-Dimensional Branes** (Multiverse Theory) - 15 assignments (10R + 5DB)
9. **Universal Mind** (Consciousness-First) - 15 assignments (5R + 10DB)
10. **Mind-Shaped Reality** (Consciousness-First) - 15 assignments (5R + 10DB)

## Expansion Methodology

For each cosmology requiring expansion to 20 R+DB assignments:

1. **Audit current state**: `node systematic_audit.js audit "Cosmology Name"`
2. **Research category patterns**: Understand category-specific beliefs
3. **Identify core beliefs**: Add R assignments for worldview-consistent beliefs
4. **Identify opposed beliefs**: Add DB assignments for contradictory beliefs  
5. **Maintain balance**: Target appropriate R/DB ratios for the category
6. **Fix logical issues**: Resolve any philosophical inconsistencies
7. **Verify completion**: Ensure exactly 20 R+DB assignments total

## Category-Specific Guidelines

- **Agnostic Spiritual Seeker**: Uncertainty, multiple paths, direct experience, reject dogma
- **Ancient Astronaut Theory**: Alien intervention, technology, archaeological evidence
- **Unconventional Skeptic**: Question orthodoxy, evidence-based, uncertainty, reject certainty
- **Simulation Hypothesis**: Reality as program/computation, information theory
- **Consciousness-First**: Consciousness fundamental, mind-first reality
- **Indigenous**: Relational, kinship, ancestral, place-based knowledge

## Cosmologies Missing Descriptions (Identified 2025-08-18)

During description data audit, **18 cosmologies** were found in `cosmology_features.json` that lack corresponding entries in `cosmology_descriptions.json`. These have been marked for removal from the quiz data to maintain consistency:

### Originally Missing (18 total):
1. **Analytical Idealism** (Consciousness-First)
2. **Appearance of Age** (Young Earth Creationism)  
3. **Contemporary Non-Dualism** (Non-dual & Beyond Concept)
4. **Emanationist Panentheism** (Panentheism)
5. **Evolutionary Creationism** (Theistic Evolution)
6. **Neutral Monism** (Consciousness-First)
7. **Participatory Panentheism** (Panentheism) 
8. **Process Panentheism** (Panentheism)
9. **Progressive Creation** (Young Earth Creationism)
10. **Quantum Idealism** (Consciousness-First)
11. **Tantric Non-Dualism** (Non-dual & Beyond Concept)
12. **Taoist Harmony** (Non-dual & Beyond Concept) 
13. **Teilhardian Evolution** (Theistic Evolution)
14. **Transcendental Idealism** (Consciousness-First)
15. **Transitional Seeking** (Agnostic Spiritual Seeker)
16. **Vajrayana Luminosity** (Non-dual & Beyond Concept)
17. **Vedantic Non-Dualism** (Non-dual & Beyond Concept)
18. **Yogācāra Buddhism** (Non-dual & Beyond Concept)

**Resolution**: Remove these 18 cosmologies from `cosmology_features.json` to ensure all remaining cosmologies have complete user-facing descriptions.

*Last Updated: 2025-08-18*
*Based on systematic audit showing 33 cosmologies needing expansion + 18 missing descriptions*