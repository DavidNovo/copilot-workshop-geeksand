# Task Board

A simple, fast, and intuitive Kanban board application for managing tasks across three workflow stages: **Todo**, **In Progress**, and **Complete**. Built with React, Vite, and Tailwind CSS.

![Kanban Board](https://via.placeholder.com/800x400?text=Task+Board)

## ✨ Features

- ✅ **3-Column Kanban Layout** - Organize tasks across Todo, In Progress, and Complete
- ✅ **Drag-and-Drop** - Move cards between columns with smooth native HTML5 drag-and-drop
- ✅ **Add Cards** - Create new tasks with title and description via modal form
- ✅ **Form Validation** - Real-time validation with helpful error messages
- ✅ **Delete Cards** - Remove tasks with confirmation dialog to prevent accidents
- ✅ **Persistent Storage** - All cards automatically saved to browser localStorage
- ✅ **Toast Notifications** - Get instant feedback on your actions
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Zero Backend** - Completely client-side; no server required

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd copilot-workshop-geeksand

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The app will hot-reload as you edit files.

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Run linter
npm run lint

# Format code with Prettier
npm run format
```

## 📖 How to Use

### Adding a Task

1. Click the **"+ Add Card"** button in the top-right
2. Enter a **Title** (required, max 100 characters)
3. Enter a **Body/Description** (required, max 500 characters)
4. Click **"Add Card"** to create the task (button only enables when both fields are valid)
5. New cards appear in the **Todo** column

### Moving a Task

1. **Click and drag** any card to another column
2. **Hover** over a column to see the drop zone highlight
3. **Release** to move the card
4. The card's position updates instantly and is saved

### Deleting a Task

1. Click the **×** button on any card
2. Confirm deletion in the dialog
3. The card is removed from the board and deleted from storage

### Persistence

- All changes are **automatically saved** to your browser's localStorage
- Refresh the page? Your tasks are still there!
- Clear browser data? Your tasks will be gone (local storage clears with cache)

## 🏗️ Project Structure

```
src/
├── components/
│   ├── TaskBoard.tsx       # Main orchestrator (state, logic)
│   ├── Column.tsx          # Kanban column container
│   ├── Card.tsx            # Individual task card
│   ├── AddCardModal.tsx    # New card form
│   └── Toast.tsx           # Notifications
├── types.ts                # TypeScript types
├── storage.ts              # localStorage utilities
├── App.tsx                 # App root
└── main.tsx                # Vite entry point
```

**For detailed architecture & data flow, see [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md)**

## 📝 Card Data Model

Each card on the board is stored with the following structure:

```json
{
  "id": "abc123xyz",
  "title": "Learn React",
  "body": "Complete the React tutorial and build a small project",
  "columnId": "in-progress",
  "createdAt": "2025-04-18T14:32:00.000Z"
}
```

**Storage Details:**
- Key: `taskboard_cards` (in localStorage)
- Format: JSON array
- Scope: Per browser (localStorage is domain-specific)

## 🧪 Testing

The app includes blackbox tests that verify user-facing behavior:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch
```

**Test Coverage:**
- Board initialization and card display
- Adding cards with validation
- Drag-and-drop between columns
- Deleting cards with confirmation
- Toast notifications
- localStorage persistence

See [src/App.test.tsx](src/App.test.tsx) for test examples.

## 🎨 Customization

### Styling

The app uses **Tailwind CSS** for all styling:
- Component styles are inline in JSX (Tailwind classes)
- Global styles in `src/index.css` and `src/App.css`
- Colors, spacing, and breakpoints defined in `tailwind.config.js`

### Changing Colors

Edit Tailwind classes in components:
```tsx
// Example: Change button color from blue to purple
<button className="bg-purple-500 hover:bg-purple-600 ...">
```

### Responsive Behavior

The layout uses Tailwind's responsive prefixes:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Vitest** | Test runner |
| **React Testing Library** | Testing utilities |
| **ESLint + Prettier** | Code quality |

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Android)

**Note:** Drag-and-drop uses native HTML5 API, supported in all modern browsers. IE 11 is not supported.

## 🚨 Known Limitations

- **No Backend**: Cards are stored locally; not synced across devices or browsers
- **localStorage Limits**: Most browsers limit localStorage to ~5-10MB per domain
- **No Authentication**: No user accounts or permissions system
- **No Offline Sync**: Works offline, but changes don't sync when online

## 🔐 Privacy

- ✅ No data sent to external servers
- ✅ All data stored locally in your browser
- ✅ No cookies or tracking
- ✅ No ads or analytics

## 📚 Learning Resources

This project demonstrates several React & web development concepts:

- **React Hooks**: `useState`, `useEffect` for state management
- **Form Handling**: Input validation, controlled components
- **Drag-and-Drop**: Native HTML5 API (no library)
- **localStorage**: Client-side persistence
- **TypeScript**: Type safety in React
- **Testing**: React Testing Library for behavior-driven tests
- **Tailwind CSS**: Utility-first CSS framework

## 🐛 Troubleshooting

### Cards not saving?
- Check if localStorage is enabled in your browser (not in private/incognito mode)
- Open DevTools → Application → localStorage and verify `taskboard_cards` exists

### Drag-and-drop not working?
- Make sure you're not using IE 11 (not supported)
- Try refreshing the page
- Check browser console for errors

### Tests failing?
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version: `node --version` (should be 18+)

## 💡 Tips for Power Users

- **Keyboard Navigation**: Tab through form fields, Enter to submit
- **Character Counts**: Watch the character counter as you type
- **Validation Feedback**: Error messages appear instantly below fields
- **Toast Messages**: Look for notifications in the top-right corner
- **Date Display**: Card creation date shown at bottom of each card

## 🤝 Contributing

To add new features or fix bugs:

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes and test: `npm run test`
3. Ensure code quality: `npm run lint && npm run format`
4. Commit and push: `git push origin feature/my-feature`
5. Open a pull request

For detailed contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

This project is open source and available under the MIT License. See [LICENSE](LICENSE) for details.

## 📖 Documentation

- **[CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md)** - Deep dive into architecture and how features work
- **[TASK_BOARD_PRD.md](TASK_BOARD_PRD.md)** - Original product requirements and acceptance criteria

## 🙋 Support

Have questions? Explore the codebase:

1. Read [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) for architecture details
2. Check [src/components/TaskBoard.tsx](src/components/TaskBoard.tsx) for the main logic
3. Review tests in [src/App.test.tsx](src/App.test.tsx) for usage examples

---

**Made with ❤️ using React + Vite**
