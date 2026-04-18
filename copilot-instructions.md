# Copilot Instructions for copilot-workshop-geeksand

## Verification Workflow

**After every code change, you MUST run:**
```bash
npm run verify
```

This command ensures:
- ✅ **Lint** (`npm run lint`) - Code style and quality checks
- ✅ **Build** (`npm run build`) - TypeScript compilation + Vite bundling
- ✅ **Test** (`npm run test -- --run`) - All tests pass

Do not skip this step. If any check fails, fix the issue and re-run verify before moving forward.

## Frontend Changes: Browser & E2E Verification

After `npm run verify` passes for UI/component changes:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Verify in browser using one of these approaches:**

   **Option A: Manual Testing with `open_browser_page`**
   - Use the `open_browser_page` tool to open http://localhost:5173
   - Manually test the specific feature changes
   - Focus on: drag-and-drop interactions, form inputs, modals, localStorage persistence

   **Option B: Automated Testing with Playwright MCP**
   - Write Playwright tests to automate the verification flow
   - Test drag-and-drop between columns, card creation/deletion, data persistence
   - This is preferred for critical flows

3. **Verify these core features work correctly:**
   - Drag-and-drop between Todo, In Progress, and Complete columns
   - Add new cards via modal form
   - Delete cards with confirmation dialog
   - Browser refresh persists all data (localStorage)

## Project Structure

```
src/
  ├── App.tsx                  # Main component
  ├── components/TaskBoard.tsx # Kanban board logic
  ├── storage.ts               # localStorage management
  ├── types.ts                 # TypeScript types
  └── test/                    # Test setup
```

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run verify` | **Always run this after changes!** Lint + Build + Test |
| `npm run dev` | Start dev server (http://localhost:5173) |
| `npm run lint` | ESLint check |
| `npm run build` | TypeScript + Vite build |
| `npm run test -- --run` | Run tests once and exit |
| `npm run format` | Auto-format code with Prettier |

## Development Guidelines

- **React**: Use hooks (useState, useEffect) in functional components
- **Styling**: Tailwind CSS utility classes only
- **State**: Use localStorage for persistence via `storage.ts` helpers
- **Drag-and-Drop**: Native HTML5 Drag and Drop API (no libraries)
- **Testing**: Vitest + React Testing Library; write meaningful tests
- **TypeScript**: Strict mode; always type component props and state

## Workflow

1. Make code changes
2. Run `npm run verify` → all checks must pass
3. For UI changes: Run `npm run dev`, then use `open_browser_page` or Playwright to test
4. Fix any failures and repeat until complete
5. Once verified, you're ready to commit
