# Drag-and-Drop Feature Specification

## User Story

As a task board user, I want to drag and drop cards between columns and reorder them within the same column so that I can organize my tasks more efficiently with intuitive interactions.

---

## Technical Requirements

- Implement using native HTML5 Drag and Drop API
- Support dragging cards between different columns
- Support reordering cards within the same column
- Provide visual feedback (opacity/ghost effect) during drag operations
- Persist all changes to localStorage
- Maintain data integrity during all drag-and-drop operations

---

## Acceptance Criteria

- [ ] User can drag a card from one column to another
- [ ] User can reorder cards within the same column by dragging
- [ ] Visual feedback (opacity/ghost effect) appears during dragging
- [ ] Drop zones are clearly indicated on hover
- [ ] Card order persists after page refresh
- [ ] Card position changes persist after page refresh
- [ ] Invalid drops are prevented (cards return to original position)
- [ ] Keyboard accessibility is considered (drag indicators/focus states)

---

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] Code follows project conventions and is reviewed
- [ ] All drag-and-drop functions have clear error handling
- [ ] Changes are saved to localStorage without errors
- [ ] No console errors or warnings during drag operations
- [ ] Unit tests written for drag logic
- [ ] Manual testing completed in development environment

---

## Phase 1: Foundation & Drag Start Logic (5-10 min review)

**Goal:** Set up draggable attributes and initialize drag state management

### Implementation Tasks

- [ ] Add `draggable="true"` attribute to Card component
- [ ] Create `onDragStart` handler in Card component:
  - [ ] Sets data transfer effect to 'move'
  - [ ] Stores card ID in dataTransfer
  - [ ] Sets draggable visual effect (ghost image or CSS class)
- [ ] Add `draggedCardId` state in TaskBoard (already exists - verify it's being used)
- [ ] Add visual feedback CSS class for dragged cards (opacity/scale effect)
- [ ] Test dragging initiates without console errors

### Acceptance for Phase 1

- [ ] Cards show visual feedback when dragging starts
- [ ] No console errors on drag start
- [ ] Drag data is properly stored in dataTransfer

---

## Phase 2: Drop Target Setup (5-10 min review)

**Goal:** Enable columns and cards to receive drops

### Implementation Tasks

- [ ] Add `onDragOver` handler to Column component:
  - [ ] Calls `e.preventDefault()` to allow drop
  - [ ] Sets `e.dataTransfer.dropEffect = 'move'`
  - [ ] Adds visual indicator (background color change) on drag over
- [ ] Add `onDragLeave` handler to Column component:
  - [ ] Removes visual indicator when drag leaves
- [ ] Add drop zone styling (highlight effect)
- [ ] Test hover state changes on columns during drag

### Acceptance for Phase 2

- [ ] Columns show visual feedback when dragged card is over them
- [ ] Visual feedback is removed when card leaves the column
- [ ] No console errors during drag over

---

## Phase 3: Between-Column Drop Logic (5-10 min review)

**Goal:** Move cards between columns on drop

### Implementation Tasks

- [ ] Add `onDrop` handler to Column component:
  - [ ] Reads card ID from dataTransfer
  - [ ] Gets the source and target column IDs
  - [ ] Calls `moveCardToColumn(cardId, targetColumnId)`
- [ ] Create `moveCardToColumn` handler in TaskBoard:
  - [ ] Finds the card by ID
  - [ ] Updates card's `columnId` to the target column
  - [ ] Updates state with new card array
  - [ ] Shows success toast message
- [ ] Handle edge cases:
  - [ ] Card dropped on same column (no-op)
  - [ ] Invalid card ID (error toast)
- [ ] Test card moves between columns and persists

### Acceptance for Phase 3

- [ ] Cards move to different columns on drop
- [ ] Cards don't move if dropped on same column
- [ ] Success toast appears after move
- [ ] Changes persist to localStorage
- [ ] No console errors

---

## Phase 4: Within-Column Reordering (5-10 min review)

**Goal:** Allow users to reorder cards within the same column

### Implementation Tasks

- [ ] Add `dragOverIndex` state in TaskBoard:
  - [ ] Track which position in the column the card hovers over
  - [ ] Reset to null on drag leave or drop
- [ ] Add `onDragOver` handler to Card component:
  - [ ] Gets card's column and index
  - [ ] Passes this info to parent via callback
  - [ ] Parent updates `dragOverIndex` state
- [ ] Create `reorderCardsInColumn(cardId, targetIndex)` handler:
  - [ ] Finds source and target indices of the card in column
  - [ ] Reorders the card array for that column
  - [ ] Updates state with new card array
  - [ ] Shows neutral toast message
- [ ] Add optional visual indicator showing insertion point
- [ ] Test reordering cards within a column

### Acceptance for Phase 4

- [ ] Cards can be reordered within the same column
- [ ] Reordered position persists to localStorage
- [ ] Toast appears confirming reorder
- [ ] No console errors
- [ ] Drag-over indicator shows insertion point (optional enhancement)

---

## Phase 5: Visual Polish & User Feedback (5-10 min review)

**Goal:** Enhance user experience with better visual feedback

### Implementation Tasks

- [ ] Implement opacity/scale effects for dragged card:
  - [ ] Set opacity to 0.5 or scale to 0.9 while dragging
  - [ ] Restore opacity/scale on drop or cancel
- [ ] Enhance drop zone highlighting:
  - [ ] Add border or background color change to target column
  - [ ] Smooth transition for visual effects
- [ ] Add cursor feedback:
  - [ ] Draggable cards show `cursor: grab` on hover
  - [ ] During drag show `cursor: grabbing`
- [ ] Optional: Add drop zone position indicator (ghost placeholder)
- [ ] Test visual effects across different browsers

### Acceptance for Phase 5

- [ ] Dragged cards have clear visual distinction (opacity/scale)
- [ ] Drop zones are clearly highlighted on drag-over
- [ ] Cursor changes provide clear affordance
- [ ] All transitions are smooth (no jarring changes)
- [ ] Visual effects work consistently

---

## Phase 6: Error Handling & Edge Cases (5-10 min review)

**Goal:** Ensure robustness and graceful degradation

### Implementation Tasks

- [ ] Handle invalid drag data:
  - [ ] Check if dropped card ID exists
  - [ ] Validate target column ID
  - [ ] Show error toast if invalid
- [ ] Handle concurrent operations:
  - [ ] Prevent multiple drag operations simultaneously
  - [ ] Reset state on any errors
- [ ] Handle localStorage failures:
  - [ ] Catch save errors and show error toast
  - [ ] Log errors to console for debugging
- [ ] Handle edge cases:
  - [ ] Dragging while another card is being added
  - [ ] Rapid successive drags
  - [ ] Tab switch during drag
- [ ] Add console warnings for development

### Acceptance for Phase 6

- [ ] All invalid drops handled gracefully
- [ ] Error toasts appear for failures
- [ ] State is never corrupted
- [ ] No unhandled promise rejections
- [ ] localStorage failures are caught

---

## Phase 7: Testing & Validation (5-10 min review)

**Goal:** Ensure quality and prevent regressions

### Implementation Tasks

- [ ] Write unit tests for:
  - [ ] `moveCardToColumn` handler
  - [ ] `reorderCardsInColumn` handler
  - [ ] Drag event handlers
- [ ] Write integration tests for:
  - [ ] Full drag-and-drop flow between columns
  - [ ] Full reorder flow within a column
  - [ ] Persistence to localStorage
- [ ] Manual testing checklist:
  - [ ] Drag cards between all column combinations
  - [ ] Reorder cards in each column
  - [ ] Refresh page and verify persistence
  - [ ] Test with keyboard accessibility tools
  - [ ] Test in Chrome, Firefox, Safari
- [ ] Verify no performance degradation with many cards

### Acceptance for Phase 7

- [ ] Unit test coverage > 80% for drag logic
- [ ] Integration tests pass
- [ ] Manual testing checklist completed
- [ ] No performance issues with 50+ cards
- [ ] Cross-browser testing completed

---

## Implementation Notes

### Code Structure Recommendations

```text
src/
├── components/
│   ├── TaskBoard.tsx      (main state management)
│   ├── Column.tsx         (drop zone for cards)
│   ├── Card.tsx           (draggable element)
│   └── DragDropHelpers/   (optional)
│       └── dragDropUtils.ts
└── types.ts               (add DragData interface if needed)
```

### State Management Pattern

In TaskBoard component:

- `[cards, setCards]` - main card list
- `[draggedCardId, setDraggedCardId]` - ID of card being dragged
- `[dragOverColumnId, setDragOverColumnId]` - column being hovered
- `[dragOverIndex, setDragOverIndex]` - index within column (optional)

### Key Handler Locations

| Component | Handlers |
|-----------|----------|
| **Card.tsx** | `onDragStart`, `onDragEnd` |
| **Column.tsx** | `onDragOver`, `onDragLeave`, `onDrop` |
| **TaskBoard.tsx** | Move/reorder logic, state management |

### Styling Suggestions

```css
/* Dragged card */
.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

/* Drop zone highlight */
.drop-zone-active {
  background-color: rgba(59, 130, 246, 0.1);
  border: 2px dashed rgba(59, 130, 246, 0.5);
}

/* Draggable affordance */
.card {
  cursor: grab;
}

.card:active {
  cursor: grabbing;
}
```

---

## Success Metrics

- ✅ Drag-and-drop feature implemented in 7 phases
- ✅ Each phase takes 5-10 minutes to review and implement
- ✅ All acceptance criteria met
- ✅ Code is well-tested and documented
- ✅ User feedback incorporated
