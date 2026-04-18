# Task Board - Product Requirements Document

## 1. Product Overview

**Product Name:** Task Board

**Description:** A simple, client-side kanban board application for managing tasks across three workflow stages.

**Target Users:** Anyone needing basic task/project management

**Tech Stack:**
- Frontend: React + Vite + TypeScript
- Storage: Browser localStorage
- No backend required

---

## 2. Core Features

### 2.1 Board Layout

- **3-Column Layout:** Todo, In Progress, Complete
- **Responsive Design:** Adapts to mobile and desktop screens
- **Empty States:** Placeholder text when columns are empty

### 2.2 Card Management

#### Add Cards

- Single "+ Add Card" button in the header
- Opens modal form with:
  - **Title** input (required, max 100 characters)
  - **Body** textarea (required, max 500 characters)
  - Submit and Cancel buttons
- Form validates both fields before submission
- New cards default to Todo column
- Automatically persist to localStorage

#### Move Cards

- Drag-and-drop cards between columns
- Visual feedback on hover and drag
- Automatic localStorage update on drop
- Smooth animations

#### Delete Cards

- Delete button on each card
- Removes card immediately from board and storage

---

## 3. Data Model

### Card Object
```json
{
  "id": "uuid-string",
  "title": "Card title",
  "body": "Card description",
  "columnId": "todo|in-progress|complete",
  "createdAt": "ISO-8601 timestamp"
}
```

### Columns

- `"todo"` - Task backlog
- `"in-progress"` - Currently being worked on
- `"complete"` - Finished tasks

### Storage

- **Key:** `"taskboard_cards"`
- **Format:** JSON array of Card objects
- **Scope:** Per-browser (localStorage)

---

## 4. User Workflows

### Workflow 1: First-Time Load
1. User opens app
2. App checks localStorage for existing cards
3. If empty, show 3 empty columns with placeholders
4. If cards exist, populate columns accordingly

### Workflow 2: Add a Card
1. User clicks "+ Add Card" button
2. Modal form opens
3. User enters title (required) and body (required)
4. User clicks Submit
5. Validation runs; if valid:
   - Card is created with unique ID
   - Card added to Todo column
   - localStorage is updated
   - Modal closes
   - Confirmation message shown
6. If validation fails:
   - Error messages displayed under fields
   - Submit button remains disabled
   - Modal stays open

### Workflow 3: Move a Card
1. User clicks and drags a card
2. Visual feedback shows the card is being dragged
3. User drags over another column
4. Drop zone is highlighted
5. User releases mouse
6. Card moves to new column
7. Card's `columnId` updated in localStorage
8. Subtle animation confirms the move

### Workflow 4: Delete a Card
1. User clicks delete button on a card
2. Card is removed from the board
3. Card removed from localStorage
4. Confirmation message shown
5. Column reformats if now empty

### Workflow 5: Persistence
1. User adds/moves/deletes cards
2. Each action auto-saves to localStorage
3. User refreshes page
4. Board loads with all previous cards in correct columns

---

## 5. Validation & Constraints

### Input Validation

**Title:**
- Required (cannot be empty or whitespace-only)
- Max length: 100 characters
- Trimmed on save
- Error message: "Title is required and must be under 100 characters"

**Body:**
- Required (cannot be empty or whitespace-only)
- Max length: 500 characters
- Trimmed on save
- Error message: "Body is required and must be under 500 characters"

### Form Behavior

- Submit button disabled until both fields are valid
- Real-time validation feedback (optional but recommended)
- Form state clears after successful submission

---

## 6. User Experience Details

### Visual Design

- Clean, minimal interface focused on task management
- Clear column headers
- Card shadows to indicate depth
- Consistent spacing and typography

### Interactions

- Drag-and-drop with visual hover effects
- Smooth transitions/animations for card moves
- Toast notifications for actions:
  - "Card added" (success)
  - "Card moved" (success, optional)
  - "Card deleted" (success)
  - "Error saving card" (error, if localStorage fails)

### Responsive Behavior

- **Desktop:** 3 columns side-by-side
- **Tablet:** Columns may wrap or scroll horizontally
- **Mobile:** Columns stack vertically OR scroll horizontally with horizontal scrollbar

---

## 7. Acceptance Criteria

- [ ] App displays 3 columns (Todo, In Progress, Complete) on load
- [ ] localStorage persists cards across browser refreshes
- [ ] "+ Add Card" button opens modal with title/body form
- [ ] Form validates: title and body required, with max character limits
- [ ] New cards appear in Todo column after submission
- [ ] Cards can be dragged and dropped to different columns
- [ ] Card's columnId updates in localStorage after move
- [ ] Delete button removes card from board and storage
- [ ] Empty columns display placeholder text
- [ ] Board layout is responsive on mobile, tablet, and desktop
- [ ] User receives feedback (toast/notification) for add/delete actions
- [ ] No console errors during normal usage
- [ ] First-time users see empty board; returning users see saved cards

---

## 8. Out of Scope

- Backend/server-side storage
- User authentication or multi-user support
- Card editing (after creation)
- Card priority, due dates, or tags
- Card filtering or search
- Dark mode or theme customization
- Card attachments or rich text formatting
- Undo/redo functionality (one-way delete)
- Export/import functionality

---

## 9. Future Enhancements (Not in MVP)

- Card editing capability
- Drag-and-drop within columns (reorder)
- Card priority levels (visual indicators)
- Due dates with time-based filtering
- Search and filter UI
- Dark mode toggle
- Import/export as JSON
- Markdown support in card body
- Tags and categories

---

## 10. Success Metrics

- App loads without errors
- All cards persist across sessions
- Drag-and-drop feels responsive and smooth
- Form validation prevents invalid data entry
- Users can complete all workflows within 30 seconds of learning the interface
