---
name: spec-create
description: Create comprehensive, well-structured feature specifications that break complex features into reviewable phases. Use this skill when creating specifications for features requiring user stories, technical requirements, acceptance criteria, and phased implementation tasks with markdown best practices compliance.
license: Complete terms in LICENSE.txt
---

# spec-create

Skill Name: **Create Complex Feature Specification**

## Purpose

Guide developers in creating comprehensive, well-structured feature specifications that break complex features into reviewable phases. Specifications include user stories, technical requirements, acceptance criteria, and phased implementation tasks with checkboxes.

## When to Use

- Creating specifications for complex features (multi-component, multi-step workflows)
- Features requiring review and implementation in phases
- Features with visual, interaction, or data persistence requirements
- Documentation that must follow markdown best practices (markdownlint compliance)

## Workflow

### Step 1: Understand Scope & Complexity

Ask clarifying questions to determine:
- **Feature Scope**: What UI elements or workflows are affected?
- **Scope Options**: E.g., cards between columns only vs. cards between columns AND reorder within column AND reorder columns
- **Technology**: Preferred libraries or native APIs?
- **UX Behavior**: Visual feedback style (basic, enhanced, animated)?
- **Persistence**: Should changes persist across sessions?
- **Complexity Level**: Simple (2-3 phases), medium (4-6 phases), complex (7+ phases)

Record responses to guide specification structure.

### Step 2: Build Specification Structure

Create markdown file with these sections:

#### A. Title & Overview
- Descriptive title (e.g., "Drag-and-Drop Feature Specification")

#### B. Core Specification Sections
1. **User Story** - "As a [user], I want to [action] so that [benefit]"
2. **Technical Requirements** - Implementation approach, technology stack, constraints
3. **Acceptance Criteria** - Checkboxes of user-visible outcomes
4. **Definition of Done** - Code quality, testing, documentation requirements

#### C. Implementation Phases
- Determine number of phases based on complexity:
  - **Simple Feature**: 2-3 phases (setup, implementation, testing)
  - **Medium Feature**: 4-6 phases (foundation, core logic, enhancements, edge cases, testing)
  - **Complex Feature**: 7+ phases (staged builds with natural breakpoints)

- Each phase should be **5-10 min review time** for a developer

#### D. Phase Structure (per phase)
For each phase include:
- **Phase N: [Name] (5-10 min review)**
- **Goal**: Clear one-sentence objective
- **Implementation Tasks**: Specific, actionable checklist items (use nested lists for sub-tasks)
- **Acceptance for Phase N**: Verification criteria

#### E. Implementation Notes (optional, but recommended)
- Code structure recommendations (file paths, component layout)
- State management patterns (variables, hooks, stores)
- Key handler locations (where logic lives)
- Styling suggestions (CSS for visual feedback)

#### F. Success Metrics
- Summary of deliverables
- Quality gates

### Step 3: Ask Clarifying Questions

Use this template:
```
vscode_askQuestions with 4-5 questions addressing:
- Feature scope/boundaries
- Technology/library preferences
- Visual/interaction feedback style
- Persistence requirements
- Any domain-specific considerations
```

Example question structure:
- Option A (simpler, recommended)
- Option B (moderate complexity)
- Option C (most comprehensive)
- "No preference - recommendations welcome"

### Step 4: Generate Phases Based on Answers

**Mapping Complexity to Phase Count:**

| Complexity | Phase Count | Examples |
|-----------|------------|----------|
| Simple UI Element | 2-3 | Form input, button state, basic modal |
| Interaction Feature | 4-6 | Drag-drop, form validation, filtering |
| Multi-feature System | 7-10 | Authentication flow, dashboard layout, data table |

**Phase Naming Convention:**
- Foundation/Setup
- Core Logic
- Additional Capability (optional, repeated)
- Polish/Refinement
- Error Handling
- Testing/Validation

### Step 5: Implement Specification Content

For each phase:
1. Write clear goal statement
2. Break down into 4-6 implementation tasks (not more, stays within 5-10 min)
3. Use sub-lists for task clarifications
4. Add 3-5 acceptance criteria per phase
5. Include code examples where helpful (e.g., handler signatures, CSS patterns)

**Task Writing Tips:**
- Start with specific action verbs: "Add", "Create", "Implement", "Handle"
- Include what to do, not how to do it
- Reference existing code/patterns when applicable
- Sub-tasks explain "why" or clarify scope

**Example Task:**
```
- [ ] Create `moveCardToColumn` handler in TaskBoard:
  - [ ] Finds the card by ID
  - [ ] Updates card's `columnId` to the target column
  - [ ] Updates state with new card array
  - [ ] Shows success toast message
```

### Step 6: Add Implementation Context

Include practical guidance:
- File structure and component organization
- State management approach (hooks, stores, context)
- Key function/handler locations
- CSS patterns for visual feedback
- Common edge cases to handle

### Step 7: Validate & Format

**Markdown Compliance:**
- ✅ All fenced code blocks have language identifiers (MD040)
- ✅ Lists surrounded by blank lines (MD032)
- ✅ Headings surrounded by blank lines (MD022)
- ✅ Consistent heading styles (MD003)
- ✅ File ends with single newline (MD047)
- ✅ No trailing spaces (MD009)
- ✅ Consistent list markers (MD004)

**Quality Checks:**
- Phases are logical and independent
- Each phase takes 5-10 min to implement
- Acceptance criteria are verifiable
- Code examples are syntactically correct
- No ambiguous language

## Output

A comprehensive markdown specification file saved to project root or docs directory that:
- Developers can implement phase-by-phase
- Provides clear completion criteria
- Follows markdown best practices
- Includes enough detail for solo implementation
- Remains concise enough for quick reference

## Success Indicators

✅ Specification is 2000-4000 words  
✅ 4-8 implementation phases  
✅ Each phase has 4-6 tasks  
✅ All markdown rules pass  
✅ Developers can implement without asking clarifying questions  
✅ Visual/interaction requirements clearly described  

## Related Skills to Create

After completing this skill, consider:
- **Implement from Specification** - Phased implementation following this spec structure
- **Code Review for Specs** - Reviewing specs for completeness and clarity
- **Refactor into Phases** - Breaking existing features into phased specs

## Example Prompts to Try

1. "Create a specification for [feature name]. Split into phases for [technology stack]"
2. "Help me spec out [user workflow]. Break it into reviewable 5-10 minute phases"
3. "Turn this feature request into a detailed spec with implementation phases"
4. "Create a spec for [feature] with particular focus on [edge case or integration]"

## Notes for Developers

- This skill works best when developers understand the feature requirement first
- Clarifying questions are essential—don't skip them
- Phase count can grow/shrink based on feature complexity
- Implementation notes should reference existing codebase patterns
- Each phase should build on previous phases logically
