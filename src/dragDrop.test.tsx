import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskBoard } from './components/TaskBoard';
import { loadCards } from './storage';

// ── localStorage mock ─────────────────────────────────────────────────────────

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] ?? null,
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function createDataTransfer() {
  const data: Record<string, string> = {};
  return {
    setData: (key: string, value: string) => { data[key] = value; },
    getData: (key: string) => data[key] ?? '',
    effectAllowed: 'move',
    dropEffect: 'move',
  };
}

async function addCard(
  user: ReturnType<typeof userEvent.setup>,
  title: string,
  body: string,
) {
  await user.click(screen.getByText('+ Add Card'));
  await user.type(screen.getByPlaceholderText('Enter card title'), title);
  await user.type(screen.getByPlaceholderText('Enter card description'), body);
  const modal = screen.getByText('Add New Card').closest('div')!;
  await user.click(within(modal).getByRole('button', { name: /add card/i }));
}

function getColumnDiv(name: string): HTMLElement {
  return screen.getByRole('heading', { name, level: 2 }).parentElement as HTMLElement;
}

function getCard(title: string): HTMLElement {
  return screen.getByText(title).closest('[draggable]') as HTMLElement;
}

function dragCardToColumn(cardTitle: string, columnName: string) {
  const dt = createDataTransfer();
  const card = getCard(cardTitle);
  const column = getColumnDiv(columnName);
  fireEvent.dragStart(card, { dataTransfer: dt });
  fireEvent.dragOver(column, { dataTransfer: dt });
  fireEvent.drop(column, { dataTransfer: dt });
  fireEvent.dragEnd(card);
}

function dragCardOverCardThenDrop(dragTitle: string, overTitle: string, columnName: string) {
  const dt = createDataTransfer();
  const dragCard = getCard(dragTitle);
  const overCard = getCard(overTitle);
  const column = getColumnDiv(columnName);
  fireEvent.dragStart(dragCard, { dataTransfer: dt });
  fireEvent.dragOver(overCard, { dataTransfer: dt }); // triggers onCardDragOver → sets dragOverIndex
  fireEvent.drop(column, { dataTransfer: dt });
  fireEvent.dragEnd(dragCard);
}

// ── Unit Tests: moveCardToColumn ──────────────────────────────────────────────

describe('moveCardToColumn', () => {
  it('moves card from Todo to In Progress', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Task A', 'Desc');

    dragCardToColumn('Task A', 'In Progress');

    expect(within(getColumnDiv('In Progress')).getByText('Task A')).toBeInTheDocument();
    expect(within(getColumnDiv('Todo')).queryByText('Task A')).not.toBeInTheDocument();
  });

  it('moves card from Todo to Complete', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Task B', 'Desc');

    dragCardToColumn('Task B', 'Complete');

    expect(within(getColumnDiv('Complete')).getByText('Task B')).toBeInTheDocument();
  });

  it('moves card back from Complete to Todo', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Task C', 'Desc');

    dragCardToColumn('Task C', 'Complete');
    dragCardToColumn('Task C', 'Todo');

    expect(within(getColumnDiv('Todo')).getByText('Task C')).toBeInTheDocument();
    expect(within(getColumnDiv('Complete')).queryByText('Task C')).not.toBeInTheDocument();
  });

  it('shows success toast on move', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Task D', 'Desc');

    dragCardToColumn('Task D', 'In Progress');

    expect(screen.getByText('Card moved')).toBeInTheDocument();
  });

  it('shows info toast when dropped on same column without reorder', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Task E', 'Desc');

    dragCardToColumn('Task E', 'Todo');

    expect(screen.getByText('Card already in this column')).toBeInTheDocument();
  });

  it('does not move card when dropped on same column', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Task F', 'Desc');

    dragCardToColumn('Task F', 'Todo');

    expect(within(getColumnDiv('Todo')).getByText('Task F')).toBeInTheDocument();
    expect(within(getColumnDiv('In Progress')).queryByText('Task F')).not.toBeInTheDocument();
  });
});

// ── Unit Tests: reorderCardsInColumn ─────────────────────────────────────────

describe('reorderCardsInColumn', () => {
  it('moves a card to an earlier position in the column', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'First', 'Desc');
    await addCard(user, 'Second', 'Desc');
    await addCard(user, 'Third', 'Desc');

    // Drag Third over First → Third moves to position 0
    dragCardOverCardThenDrop('Third', 'First', 'Todo');

    const headings = within(getColumnDiv('Todo')).getAllByRole('heading', { level: 3 });
    expect(headings[0]).toHaveTextContent('Third');
  });

  it('moves a card to a later position in the column', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Alpha', 'Desc');
    await addCard(user, 'Beta', 'Desc');
    await addCard(user, 'Gamma', 'Desc');

    // Drag Alpha over Gamma → Alpha moves toward the end
    dragCardOverCardThenDrop('Alpha', 'Gamma', 'Todo');

    const headings = within(getColumnDiv('Todo')).getAllByRole('heading', { level: 3 });
    expect(headings[0]).not.toHaveTextContent('Alpha');
  });

  it('shows "Card reordered" toast on successful reorder', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'One', 'Desc');
    await addCard(user, 'Two', 'Desc');

    dragCardOverCardThenDrop('Two', 'One', 'Todo');

    expect(screen.getByText('Card reordered')).toBeInTheDocument();
  });

  it('persists reordered position to localStorage', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Item 1', 'Desc');
    await addCard(user, 'Item 2', 'Desc');
    await addCard(user, 'Item 3', 'Desc');

    dragCardOverCardThenDrop('Item 3', 'Item 1', 'Todo');

    const saved = loadCards().filter((c) => c.columnId === 'todo');
    expect(saved[0].title).toBe('Item 3');
  });
});

// ── Unit Tests: Drag Event Handlers ──────────────────────────────────────────

describe('Drag event handlers', () => {
  it('applies opacity CSS class to the card being dragged', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Drag Me', 'Desc');

    const card = getCard('Drag Me');
    const dt = createDataTransfer();

    fireEvent.dragStart(card, { dataTransfer: dt });

    expect(card).toHaveClass('opacity-50');
  });

  it('removes opacity CSS class after dragEnd (drag cancelled)', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Cancel Me', 'Desc');

    const card = getCard('Cancel Me');
    const dt = createDataTransfer();

    fireEvent.dragStart(card, { dataTransfer: dt });
    expect(card).toHaveClass('opacity-50');

    fireEvent.dragEnd(card);

    expect(getCard('Cancel Me')).not.toHaveClass('opacity-50');
  });

  it('cancelled drag does not move the card', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Stay Put', 'Desc');

    const card = getCard('Stay Put');
    const dt = createDataTransfer();

    fireEvent.dragStart(card, { dataTransfer: dt });
    fireEvent.dragEnd(card); // cancel without drop

    expect(within(getColumnDiv('Todo')).getByText('Stay Put')).toBeInTheDocument();
  });

  it('shows error toast when drop fires without a prior drag', () => {
    render(<TaskBoard />);
    const dt = createDataTransfer();

    fireEvent.drop(getColumnDiv('In Progress'), { dataTransfer: dt });

    expect(screen.getByText('Error: No card selected')).toBeInTheDocument();
  });

  it('prevents drag start when the add-card modal is open', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Modal Card', 'Desc');

    // Open modal without submitting
    await user.click(screen.getByText('+ Add Card'));

    const card = getCard('Modal Card');
    const dt = createDataTransfer();
    const inProgress = getColumnDiv('In Progress');

    fireEvent.dragStart(card, { dataTransfer: dt });
    fireEvent.drop(inProgress, { dataTransfer: dt });

    // draggedCardId was never set, so the card should not have moved
    expect(within(inProgress).queryByText('Modal Card')).not.toBeInTheDocument();
  });

  it('prevents a second concurrent drag from overwriting the first', async () => {
    const user = userEvent.setup();
    render(<TaskBoard />);
    await addCard(user, 'Card One', 'Desc');
    await addCard(user, 'Card Two', 'Desc');

    const dt = createDataTransfer();
    const cardOne = getCard('Card One');
    const cardTwo = getCard('Card Two');
    const complete = getColumnDiv('Complete');

    // Start dragging Card One
    fireEvent.dragStart(cardOne, { dataTransfer: dt });
    // Try to start dragging Card Two while Card One is in flight (should be blocked)
    fireEvent.dragStart(cardTwo, { dataTransfer: dt });

    fireEvent.drop(complete, { dataTransfer: dt });
    fireEvent.dragEnd(cardOne);

    // Only Card One should have moved; Card Two stays in Todo
    expect(within(complete).getByText('Card One')).toBeInTheDocument();
    expect(within(getColumnDiv('Todo')).getByText('Card Two')).toBeInTheDocument();
  });
});

// ── Integration Tests ─────────────────────────────────────────────────────────

describe('Drag and Drop - Integration', () => {
  describe('Between-column drag flow', () => {
    it('full flow: Todo → In Progress persists to localStorage', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      await addCard(user, 'Persist Move', 'Desc');

      dragCardToColumn('Persist Move', 'In Progress');

      const saved = loadCards();
      expect(saved.find((c) => c.title === 'Persist Move')?.columnId).toBe('in-progress');
    });

    it('full flow: In Progress → Complete persists to localStorage', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      await addCard(user, 'Complete Me', 'Desc');

      dragCardToColumn('Complete Me', 'In Progress');
      dragCardToColumn('Complete Me', 'Complete');

      const saved = loadCards();
      expect(saved.find((c) => c.title === 'Complete Me')?.columnId).toBe('complete');
    });

    it('moved card loads in the correct column after remount', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<TaskBoard />);
      await addCard(user, 'Reload Me', 'Desc');

      dragCardToColumn('Reload Me', 'In Progress');
      unmount();

      render(<TaskBoard />);

      expect(within(getColumnDiv('In Progress')).getByText('Reload Me')).toBeInTheDocument();
      expect(within(getColumnDiv('Todo')).queryByText('Reload Me')).not.toBeInTheDocument();
    });
  });

  describe('Within-column reorder flow', () => {
    it('reordered cards load in correct order after remount', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<TaskBoard />);
      await addCard(user, 'Reorder 1', 'Desc');
      await addCard(user, 'Reorder 2', 'Desc');

      dragCardOverCardThenDrop('Reorder 2', 'Reorder 1', 'Todo');
      unmount();

      render(<TaskBoard />);

      const headings = within(getColumnDiv('Todo')).getAllByRole('heading', { level: 3 });
      expect(headings[0]).toHaveTextContent('Reorder 2');
    });
  });

  describe('localStorage failure handling', () => {
    it('shows error toast when localStorage save throws', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      await addCard(user, 'Fail Save', 'Desc');

      vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      dragCardToColumn('Fail Save', 'In Progress');

      await waitFor(() => {
        expect(screen.getByText('Failed to save changes')).toBeInTheDocument();
      });
    });

    it('renders empty board gracefully when localStorage contains corrupt JSON', () => {
      localStorage.setItem('taskboard_cards', 'not-valid-json{{{');

      render(<TaskBoard />);

      expect(screen.getAllByText('No cards yet')).toHaveLength(3);
    });
  });
});
