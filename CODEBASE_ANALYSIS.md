# Task Board - Codebase Analysis

## Project Overview

The **Task Board** is a client-side Kanban board application built with React, Vite, and TypeScript. It provides a simple interface for managing tasks across three workflow stages (Todo, In Progress, Complete) with full localStorage persistence and a smooth drag-and-drop experience.

**Tech Stack:**
- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS 4
- **Storage**: Browser localStorage
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

---

## Project Structure

```
src/
├── components/              # React components
│   ├── TaskBoard.tsx       # Main board container (state management, logic)
│   ├── Column.tsx          # Column component (Todo, In Progress, Complete)
│   ├── Card.tsx            # Individual card with delete confirmation
│   ├── AddCardModal.tsx    # Modal form for creating new cards
│   └── Toast.tsx           # Toast notification system
├── types.ts                # TypeScript type definitions
├── storage.ts              # localStorage utilities
├── App.tsx                 # App root component
├── main.tsx                # Vite entry point
├── index.css               # Global styles
├── App.css                 # App-specific styles
├── assets/                 # Static assets
└── test/
    └── setup.ts            # Vitest/Testing Library configuration
```

---

## Architecture & Data Flow

### Component Hierarchy

```
App
└── TaskBoard (main orchestrator)
    ├── Header (+ Add Card button)
    ├── Board (3-column grid)
    │   ├── Column (Todo)
    │   │   └── Card[] (draggable)
    │   ├── Column (In Progress)
    │   │   └── Card[] (draggable)
    │   └── Column (Complete)
    │       └── Card[] (draggable)
    ├── AddCardModal (conditional render)
    └── ToastContainer (floating notifications)
```

### State Management

**TaskBoard Component State:**
- `cards: Card[]` - All cards in the board
- `isModalOpen: boolean` - Controls AddCardModal visibility
- `toasts: Toast[]` - Active toast notifications
- `draggedCardId: string | null` - Tracks currently dragged card

**Card Object Structure:**
```typescript
interface Card {
  id: string;                           // UUID generated on creation
  title: string;                        // Max 100 chars
  body: string;                         // Max 500 chars
  columnId: 'todo' | 'in-progress' | 'complete'; // Current column
  createdAt: string;                    // ISO-8601 timestamp
}
```

---

## Core Features & How They Work

### 1. **Displaying the Board**
- **File**: `src/components/TaskBoard.tsx` (lines 25-27)
- **Flow**:
  1. On component mount, `useEffect` calls `loadCards()` from localStorage
  2. Loaded cards are stored in state
  3. Cards are filtered by `columnId` into three arrays
  4. Each array is passed to a `Column` component
  5. Columns render with draggable `Card` children or empty placeholder

**Code Reference:**
```typescript
useEffect(() => {
  const loadedCards = loadCards();
  setCards(loadedCards);
}, []);

const todoCards = cards.filter((card) => card.columnId === 'todo');
const inProgressCards = cards.filter((card) => card.columnId === 'in-progress');
const completeCards = cards.filter((card) => card.columnId === 'complete');
```

### 2. **Adding a Card**
- **File**: `src/components/AddCardModal.tsx`
- **Flow**:
  1. User clicks "+ Add Card" button in header
  2. `AddCardModal` opens (controlled by `isModalOpen` state)
  3. Form validates title (required, max 100 chars) and body (required, max 500 chars)
  4. Submit button is disabled until both fields are valid
  5. On submit:
     - `handleAddCard()` creates a Card object with unique ID and timestamp
     - New card defaults to `columnId: 'todo'`
     - Card is added to state with `setCards()`
     - Modal closes and success toast appears
  6. `useEffect` in TaskBoard auto-saves cards to localStorage

**Validation Rules:**
- Title: Required, non-empty after trim, ≤ 100 characters
- Body: Required, non-empty after trim, ≤ 500 characters
- Submit button: Disabled until both fields are valid
- Error messages displayed inline under fields

### 3. **Moving Cards (Drag-and-Drop)**
- **File**: `src/components/TaskBoard.tsx` (lines 53-79)
- **Approach**: Native HTML5 Drag and Drop API (no external library)
- **Flow**:
  1. User drags a card (Card component has `draggable={true}`)
  2. `onDragStart` event stores `draggedCardId` in state and sets `effectAllowed: 'move'`
  3. User drags over Column component
  4. `onDragOver` event on Column prevents default and sets `dropEffect: 'move'`
  5. User drops card on target Column
  6. `onDrop` event:
     - Finds the card by `draggedCardId`
     - Updates its `columnId` to target column
     - Clears `draggedCardId`
     - Shows success toast
     - localStorage auto-saves via useEffect

**Code Reference:**
```typescript
const handleDrop = (e: React.DragEvent, columnId: 'todo' | 'in-progress' | 'complete') => {
  e.preventDefault();
  if (!draggedCardId) return;
  
  setCards((prev) =>
    prev.map((card) =>
      card.id === draggedCardId ? { ...card, columnId } : card
    )
  );
  
  setDraggedCardId(null);
  addToast('Card moved', 'success');
};
```

### 4. **Deleting Cards**
- **File**: `src/components/Card.tsx`
- **Flow**:
  1. User clicks delete button (×) on card
  2. Delete confirmation modal appears (local Card state)
  3. User confirms or cancels
  4. On confirm:
     - `onDelete()` callback fires from parent (TaskBoard)
     - `handleDeleteCard()` filters out the card from state
     - localStorage auto-saves
     - Success toast appears

**Code Reference:**
```typescript
const handleDeleteCard = (cardId: string) => {
  setCards((prev) => prev.filter((card) => card.id !== cardId));
  addToast('Card deleted', 'success');
};
```

### 5. **Toast Notifications**
- **File**: `src/components/Toast.tsx`
- **Features**:
  - Auto-dismiss after 3 seconds
  - Color-coded: green (success), red (error), blue (info)
  - Fixed position (top-right corner)
  - Multiple toasts can stack
- **Usage**:
  ```typescript
  addToast('Card added', 'success');
  addToast('Error saving card', 'error');
  ```

### 6. **localStorage Persistence**
- **File**: `src/storage.ts`
- **Key**: `'taskboard_cards'`
- **Format**: JSON string of Card array
- **Auto-Save Logic**: TaskBoard has a `useEffect` that watches `cards` state:
  ```typescript
  useEffect(() => {
    saveCards(cards);
  }, [cards]);
  ```
- **On App Load**: TaskBoard loads cards on mount:
  ```typescript
  useEffect(() => {
    const loadedCards = loadCards();
    setCards(loadedCards);
  }, []);
  ```

---

## Key Files Explained

### `src/types.ts`
TypeScript type definitions used across the app:
- `Card` - Full card object structure
- `ColumnId` - Union type of valid column IDs
- `Toast` - Toast notification structure

### `src/storage.ts`
Utility functions for localStorage operations:
- `loadCards()` - Retrieves and parses cards from localStorage, returns empty array if not found
- `saveCards()` - Serializes and saves cards to localStorage with error handling
- `generateId()` - Creates unique IDs using `Math.random()` + `Date.now()`

### `src/components/TaskBoard.tsx`
**The main orchestrator component** - responsible for:
- Managing all state (cards, modal visibility, toasts, dragged card)
- Loading/saving to localStorage
- Handling all card operations (add, delete, move)
- Managing toast lifecycle
- Rendering the board layout and coordinating child components

Key functions:
- `handleAddCard()` - Creates new card, adds to state, closes modal
- `handleDeleteCard()` - Removes card from state
- `handleDragStart()` - Initiates drag operation
- `handleDrop()` - Completes drag operation, updates card position
- `addToast()` - Creates and tracks toast notifications
- `dismissToast()` - Removes toast from state

### `src/components/Column.tsx`
**Container for a single kanban column:**
- Displays column title and card count
- Provides drop zone for drag-and-drop
- Renders empty state if no cards
- Delegates card rendering to Card component

### `src/components/Card.tsx`
**Individual card component with delete confirmation:**
- Displays title, body, and creation date
- Handles drag initiation
- Shows delete confirmation modal (local state, independent of parent)
- On confirm delete, calls `onDelete()` callback

### `src/components/AddCardModal.tsx`
**Modal form for creating new cards:**
- Real-time character count display
- Form validation with error messages
- Disabled submit button when fields invalid
- Clears form on successful submission or cancel

### `src/components/Toast.tsx`
**Toast notification system:**
- `ToastNotification` - Individual toast component with auto-dismiss
- `ToastContainer` - Manages multiple toasts, stacked in top-right
- Uses `useEffect` to auto-dismiss after 3 seconds

---

## Data Flow: Adding a Card (End-to-End Example)

1. User clicks "+ Add Card" button → `isModalOpen` state becomes `true`
2. `AddCardModal` renders
3. User types title "Learn React" and body "Complete React tutorial"
4. Form validates in real-time (character counts shown)
5. Submit button becomes enabled
6. User clicks "Add Card" button
7. `handleSubmit()` validates fields (title < 100, body < 500, non-empty)
8. `onSubmit()` calls `handleAddCard()` in TaskBoard
9. New Card object created with unique ID and ISO timestamp
10. Card added to `cards` state array with `columnId: 'todo'`
11. Modal closes (`isModalOpen` → `false`)
12. Success toast appears for 3 seconds
13. `useEffect` detects `cards` change and calls `saveCards()`
14. Cards serialized to JSON and saved in localStorage
15. TaskBoard re-filters cards by column and re-renders
16. New card appears in Todo column

---

## Data Flow: Moving a Card (End-to-End Example)

1. User clicks and drags card in "Todo" column
2. `handleDragStart()` stores card ID in `draggedCardId` state
3. User drags over "In Progress" column
4. Column's `onDragOver` handler allows drop (preventDefault)
5. User releases mouse
6. Column's `onDrop` handler fires with `columnId: 'in-progress'`
7. `handleDrop()` finds card by ID and updates its `columnId`
8. `setCards()` triggers state update
9. Success toast appears: "Card moved"
10. `useEffect` detects `cards` change and saves to localStorage
11. TaskBoard re-filters: card no longer in Todo, now in In Progress
12. Both columns re-render with updated card lists
13. UI smoothly reflects the card in new column

---

## Testing Strategy

The app is tested with **blackbox tests** (behavior-driven), not unit tests. This means:
- Tests treat the app as a "black box" - testing user interactions and outcomes
- Tests don't depend on implementation details (component names, functions, etc.)
- Tests use React Testing Library to query by user-facing elements (labels, text, roles)
- If implementation changes but behavior stays the same, tests still pass

**Test Coverage:**
- ✅ Board displays 3 columns on load
- ✅ Adding a card with valid data
- ✅ Form validation (title/body required, max chars)
- ✅ Drag-and-drop moves cards between columns
- ✅ Delete confirmation and deletion
- ✅ localStorage persistence across page reloads
- ✅ Toast notifications appear and auto-dismiss

---

## Performance Considerations

1. **Filtering**: Cards are filtered by `columnId` on every render - efficient for typical board sizes (<1000 cards)
2. **localStorage**: Serialization/deserialization on every change - acceptable for small datasets
3. **Drag-and-drop**: Native HTML5 API is performant and doesn't require external libraries
4. **Re-renders**: React properly memoizes through functional components; state is co-located in TaskBoard

---

## Common Development Tasks

### Adding a New Feature (e.g., Card Priority)

1. **Update Card type** in `src/types.ts`:
   ```typescript
   interface Card {
     // ... existing fields
     priority: 'low' | 'medium' | 'high'; // Add this
   }
   ```

2. **Update AddCardModal** to collect priority input

3. **Update Card component** to display priority (e.g., colored badge)

4. **Tests will catch** if localStorage persists the new field

### Changing Styling

- Use Tailwind CSS classes in component JSX
- Global styles in `src/index.css` and `src/App.css`
- No CSS-in-JS library required

### Modifying Validation Rules

- Edit validation logic in `AddCardModal.tsx` `validate()` function
- Update error messages inline
- Tests verify validation works

---

## Debugging Tips

1. **Check localStorage in browser DevTools**:
   - Open DevTools → Application → localStorage → `taskboard_cards`
   - Should contain JSON array of cards

2. **Check React DevTools**:
   - Inspect TaskBoard component state
   - Watch state changes as you interact

3. **Check Console**:
   - Error from localStorage? Logged in `storage.ts`
   - Check for React warnings

4. **Test card movement**:
   - Open DevTools Network tab to verify no API calls
   - All movement is client-side

---

## Future Enhancement Ideas

- [ ] Card categories/tags
- [ ] Card priority levels with visual indicators
- [ ] Assignees on cards
- [ ] Due dates with calendar picker
- [ ] Card comments/notes
- [ ] Search and filter functionality
- [ ] Board themes (light/dark)
- [ ] Export board as CSV or JSON
- [ ] Undo/redo for recent actions
- [ ] Keyboard shortcuts for power users
- [ ] Multi-user sync (backend required)
