# Systematic Cosmology Audit Methodology

## Overview
A comprehensive framework for auditing, improving, and validating all cosmology profiles in the quiz database.

## Phase 1: Audit Standards

### Minimum Profile Requirements
- **Priority 1 (Critical)**: 0-5 total R+DB → Target: 15+ assignments
- **Priority 2 (Under-specified)**: 6-10 total R+DB → Target: 20+ assignments  
- **Priority 3 (Sparse)**: 11-15 total R+DB → Target: 25+ assignments
- **Priority 4 (Review)**: 16-25 total R+DB → Target: Consistency check
- **Well-specified**: 25+ total R+DB → Target: Validation only

### Logical Consistency Rules

#### 1. **Religious/Theistic Cosmologies**
- **Required (R)**: Core doctrinal beliefs, sacred texts, deity characteristics
- **Opposed (DB)**: Incompatible religious claims, atheistic positions
- **Not Related (NR)**: Scientific details, unrelated metaphysics

#### 2. **Scientific/Materialist Cosmologies**  
- **Required (R)**: Scientific methodology, naturalistic explanations
- **Opposed (DB)**: Supernatural claims, anti-science positions
- **Not Related (NR)**: Religious questions without scientific bearing

#### 3. **Skeptic/Agnostic Cosmologies**
- **Required (R)**: Epistemic humility, uncertainty, questioning
- **Opposed (DB)**: Only clear anti-science or dogmatic positions
- **Not Related (NR)**: Most metaphysical/spiritual claims (agnostic stance)

#### 4. **Mystical/Spiritual Cosmologies**
- **Required (R)**: Core spiritual practices, transcendent reality
- **Opposed (DB)**: Materialist reductionism, rigid scientism
- **Not Related (NR)**: Technical scientific details, sectarian specifics

#### 5. **Conspiracy/Alternative Cosmologies**
- **Required (R)**: Questioning mainstream narratives, hidden knowledge
- **Opposed (DB)**: Official explanations, mainstream consensus
- **Not Related (NR)**: Unrelated conspiratorial claims

## Phase 2: Research Standards

### Primary Sources Priority
1. **Foundational Texts**: Original philosophical/religious works
2. **Academic Sources**: Scholarly articles and books
3. **Authoritative Websites**: Stanford Encyclopedia, etc.
4. **Contemporary Practitioners**: Modern interpretations

### Documentation Requirements
- Source citations for all major assignments
- Rationale for controversial R/DB decisions
- Distinguishing features from similar cosmologies
- Cultural/historical context notes

## Phase 3: Implementation Process

### Step 1: Profile Analysis
```bash
node audit_cosmologies.js analyze "Cosmology Name"
```
- Check current R/DB/NR distribution
- Identify logical inconsistencies
- Compare with similar cosmologies

### Step 2: Research Phase
- Research core beliefs and practices
- Identify distinguishing characteristics
- Map incompatible worldviews
- Document sources and rationale

### Step 3: Update Assignments
- Apply systematic R/DB/NR logic
- Ensure minimum profile density
- Maintain logical consistency
- Document all changes

### Step 4: Validation Testing
```bash
# Add to test-quiz-engine for manual verification
# Test authentic answer generation
# Verify top ranking in results
```

### Step 5: Quality Assurance
- Cross-check with similar cosmologies
- Verify no unintended eliminations
- Test edge cases and borderline answers
- Document any issues

## Phase 4: Automated Testing Framework

### Dynamic Test Generation
- Automatically generate test buttons for all cosmologies
- Create authentic answer profiles using R/DB assignments
- Run quiz engine tests for each cosmology
- Validate that target cosmology ranks in top 3

### Success Criteria
- Target cosmology appears in top 3 results ≥90% of time
- Generated profile reflects authentic adherent responses
- No logical contradictions in answer patterns
- Distinguishable from similar cosmologies

### Validation Metrics
- **Profile Density**: Minimum assignments per category
- **Ranking Accuracy**: Target cosmology ranking
- **Answer Authenticity**: Realistic response patterns
- **Distinguishability**: Unique features vs. similar worldviews

## Phase 5: Systematic Application

### Batch Processing Order
1. **Priority 1**: Critical cosmologies (0-5 assignments)
2. **Priority 2**: Under-specified (6-10 assignments)
3. **Priority 3**: Sparse (11-15 assignments)
4. **Skeptic/Agnostic**: Apply consistent agnostic logic
5. **Similar Clusters**: Process related cosmologies together
6. **Priority 4**: Consistency review and refinement

### Quality Gates
- Each cosmology must pass validation testing
- Similar cosmologies must have distinguishing features
- No cosmology should have <10 total R+DB assignments
- All assignments must have documented rationale

## Phase 6: Continuous Validation

### Automated Monitoring
- Daily test runs for all cosmologies
- Regression detection for ranking changes
- Profile drift monitoring
- Performance metrics tracking

### Maintenance Process
- Regular review of underperforming cosmologies
- Updates based on new research/sources
- Community feedback integration
- Consistency maintenance across updates

## Tools and Scripts

### Core Scripts
- `audit_cosmologies.js` - Profile analysis and reporting
- `systematic_audit.js` - Batch processing framework
- `validate_cosmology.js` - Individual cosmology testing
- `test_generator.js` - Dynamic test button generation

### Validation Tools
- Quiz engine integration testing
- Answer authenticity verification
- Ranking accuracy measurement
- Profile consistency checking

## Success Metrics

### Individual Cosmology Goals
- Minimum 15 total R+DB assignments
- Target cosmology ranks top 3 in 90%+ of tests
- Logically consistent belief structure
- Distinguishable from similar cosmologies

### System-Wide Goals
- Average profile density >25%
- <5% of cosmologies with critical issues
- 100% test coverage for all cosmologies
- Clear differentiation between worldview clusters

This methodology ensures systematic, research-based, and validated improvements to all cosmology profiles.