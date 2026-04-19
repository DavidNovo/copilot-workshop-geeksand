# Drag-and-Drop Feature Specification

## User Story

As a task board user, I want to drag and drop cards between columns and reorder
them within the same column so that I can organize my tasks more efficiently
with intuitive interactions.

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

### Implementation Tasks - Phase 1

- [x] Add `draggable="true"` attribute to Card component
- [x] Create `onDragStart` handler in Card component:
  - [x] Sets data transfer effect to 'move'
  - [x] Stores card ID in dataTransfer
  - [x] Sets draggable visual effect (ghost image or CSS class)
- [x] Add `draggedCardId` state in TaskBoard
  (already exists - verify it's being used)
- [x] Add visual feedback CSS class for dragged cards (opacity/scale effect)
- [x] Test dragging initiates without console errors

### Acceptance for Phase 1

- [x] Cards show visual feedback when dragging starts
- [x] No console errors on drag start
- [x] Drag data is properly stored in dataTransfer

---

## Phase 2: Drop Target Setup (5-10 min review)

**Goal:** Enable columns and cards to receive drops

### Implementation Tasks - Phase 2

- [x] Add `onDragOver` handler to Column component:
  - [x] Calls `e.preventDefault()` to allow drop
  - [x] Sets `e.dataTransfer.dropEffect = 'move'`
  - [x] Adds visual indicator (background color change) on drag over
- [x] Add `onDragLeave` handler to Column component:
  - [x] Removes visual indicator when drag leaves
- [x] Add drop zone styling (highlight effect)
- [x] Test hover state changes on columns during drag

### Acceptance for Phase 2

- [x] Columns show visual feedback when dragged card is over them
- [x] Visual feedback is removed when card leaves the column
- [x] No console errors during drag over

---

## Phase 3: Between-Column Drop Logic (5-10 min review)

**Goal:** Move cards between columns on drop

### Implementation Tasks - Phase 3

- [x] Add `onDrop` handler to Column component:
  - [x] Reads card ID from dataTransfer
  - [x] Gets the source and target column IDs
  - [x] Calls `moveCardToColumn(cardId, targetColumnId)`
- [x] Create `moveCardToColumn` handler in TaskBoard:
  - [x] Finds the card by ID
  - [x] Updates card's `columnId` to the target column
  - [x] Updates state with new card array
  - [x] Shows success toast message
- [x] Handle edge cases:
  - [x] Card dropped on same column (no-op)
  - [x] Invalid card ID (error toast)
- [x] Test card moves between columns and persists

### Acceptance for Phase 3

- [x] Cards move to different columns on drop
- [x] Cards don't move if dropped on same column
- [x] Success toast appears after move
- [x] Changes persist to localStorage
- [x] No console errors

---

## Phase 4: Within-Column Reordering (5-10 min review)

**Goal:** Allow users to reorder cards within the same column

### Implementation Tasks - Phase 4

- [x] Add `dragOverIndex` state in TaskBoard:
  - [x] Track which position in the column the card hovers over
  - [x] Reset to null on drag leave or drop
- [x] Add `onDragOver` handler to Card component:
  - [x] Gets card's column and index
  - [x] Passes this info to parent via callback
  - [x] Parent updates `dragOverIndex` state
- [x] Create `reorderCardsInColumn(cardId, targetIndex)` handler:
  - [x] Finds source and target indices of the card in column
  - [x] Reorders the card array for that column
  - [x] Updates state with new card array
  - [x] Shows neutral toast message
- [x] Add optional visual indicator showing insertion point
- [x] Test reordering cards within a column

### Acceptance for Phase 4

- [x] Cards can be reordered within the same column
- [x] Reordered position persists to localStorage
- [x] Toast appears confirming reorder
- [x] No console errors
- [x] Drag-over indicator shows insertion point (optional enhancement)

---

## Phase 5: Visual Polish & User Feedback (5-10 min review)

**Goal:** Enhance user experience with better visual feedback

### Implementation Tasks - Phase 5

- [x] Implement opacity/scale effects for dragged card:
  - [x] Set opacity to 0.5 or scale to 0.9 while dragging
  - [x] Restore opacity/scale on drop or cancel
- [x] Enhance drop zone highlighting:
  - [x] Add border or background color change to target column
  - [x] Smooth transition for visual effects
- [x] Add cursor feedback:
  - [x] Draggable cards show `cursor: grab` on hover
  - [x] During drag show `cursor: grabbing`
- [x] Optional: Add drop zone position indicator (ghost placeholder)
- [x] Test visual effects across different browsers

### Acceptance for Phase 5

- [x] Dragged cards have clear visual distinction (opacity/scale)
- [x] Drop zones are clearly highlighted on drag-over
- [x] Cursor changes provide clear affordance
- [x] All transitions are smooth (no jarring changes)
- [x] Visual effects work consistently

---

## Phase 6: Error Handling & Edge Cases (5-10 min review)

**Goal:** Ensure robustness and graceful degradation

### Implementation Tasks - Phase 6

- [x] Handle invalid drag data:
  - [x] Check if dropped card ID exists
  - [x] Validate target column ID
  - [x] Show error toast if invalid
- [x] Handle concurrent operations:
  - [x] Prevent multiple drag operations simultaneously
  - [x] Reset state on any errors
- [x] Handle localStorage failures:
  - [x] Catch save errors and show error toast
  - [x] Log errors to console for debugging
- [x] Handle edge cases:
  - [x] Dragging while another card is being added
  - [x] Rapid successive drags
  - [x] Tab switch during drag
- [x] Add console warnings for development

### Acceptance for Phase 6

- [x] All invalid drops handled gracefully
- [x] Error toasts appear for failures
- [x] State is never corrupted
- [x] No unhandled promise rejections
- [x] localStorage failures are caught

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
| --------- | -------- |
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
