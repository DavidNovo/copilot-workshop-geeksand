import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskBoard } from './components/TaskBoard';
import { loadCards } from './storage';

// Setup localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

/**
 * BLACKBOX TESTS for Task Board
 * Tests user-facing behavior without depending on implementation details
 */

describe('Task Board - Blackbox Tests', () => {
  describe('Board Display', () => {
    it('displays 3 columns on load', () => {
      render(<TaskBoard />);
      expect(screen.getByText('Todo')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    it('displays empty state when no cards', () => {
      render(<TaskBoard />);
      const emptyMessages = screen.getAllByText('No cards yet');
      expect(emptyMessages.length).toBe(3);
    });

    it('displays + Add Card button', () => {
      render(<TaskBoard />);
      expect(screen.getByText('+ Add Card')).toBeInTheDocument();
    });
  });

  describe('Adding Cards', () => {
    it('opens modal when + Add Card is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      await user.click(screen.getByText('+ Add Card'));
      expect(screen.getByText('Add New Card')).toBeInTheDocument();
    });

    it('adds new card with valid data', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      // Click header button
      const headerButton = screen.getByText('+ Add Card');
      await user.click(headerButton);
      
      // Fill form
      const titleInput = screen.getByPlaceholderText('Enter card title');
      const bodyInput = screen.getByPlaceholderText('Enter card description');
      
      await user.type(titleInput, 'Learn React');
      await user.type(bodyInput, 'Complete tutorial');
      
      // Find modal submit button (inside modal, not header)
      const modal = screen.getByText('Add New Card').closest('div');
      const submitBtn = within(modal!).getByRole('button', { name: /add card/i });
      
      await user.click(submitBtn);
      
      // Verify card appears
      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(screen.getByText('Complete tutorial')).toBeInTheDocument();
    });

    it('shows success toast on card add', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'Task');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Desc');
      
      const modal = screen.getByText('Add New Card').closest('div');
      const submitBtn = within(modal!).getByRole('button', { name: /add card/i });
      await user.click(submitBtn);
      
      expect(screen.getByText('Card added')).toBeInTheDocument();
    });

    it('places new cards in Todo column', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'New Task');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Description');
      
      const modal = screen.getByText('Add New Card').closest('div');
      const submitBtn = within(modal!).getByRole('button', { name: /add card/i });
      await user.click(submitBtn);
      
      const todoCol = screen.getByRole('heading', { name: 'Todo' }).closest('div');
      expect(within(todoCol!).getByText('New Task')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('disables submit until both fields valid', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      await user.click(screen.getByText('+ Add Card'));
      
      const modal = screen.getByText('Add New Card').closest('div');
      const submitBtn = within(modal!).getByRole('button', { name: /add card/i });
      
      expect(submitBtn).toBeDisabled();
      
      await user.type(screen.getByPlaceholderText('Enter card title'), 'Title');
      expect(submitBtn).toBeDisabled();
      
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Body');
      expect(submitBtn).not.toBeDisabled();
    });

    it('enforces title max length', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      await user.click(screen.getByText('+ Add Card'));
      
      const titleInput = screen.getByPlaceholderText('Enter card title') as HTMLInputElement;
      await user.type(titleInput, 'a'.repeat(150));
      
      expect(titleInput.value.length).toBe(100);
    });

    it('enforces body max length', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      await user.click(screen.getByText('+ Add Card'));
      
      const bodyInput = screen.getByPlaceholderText('Enter card description') as HTMLTextAreaElement;
      await user.type(bodyInput, 'a'.repeat(600));
      
      expect(bodyInput.value.length).toBe(500);
    });

    it('displays character counter', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'Hi');
      
      expect(screen.getByText(/2\/100/)).toBeInTheDocument();
    });
  });

  describe('Deleting Cards', () => {
    it('shows delete confirmation', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      // Add card
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'Card');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Desc');
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      
      // Click delete button (×)
      const deleteBtn = screen.getByText('×');
      await user.click(deleteBtn);
      
      expect(screen.getByText('Delete Card?')).toBeInTheDocument();
    });

    it('deletes card on confirmation', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      // Add card
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'Delete Me');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Desc');
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      
      expect(screen.getByText('Delete Me')).toBeInTheDocument();
      
      // Delete
      const deleteBtn = screen.getByText('×');
      await user.click(deleteBtn);
      
      const confirmModal = screen.getByText('Delete Card?').closest('div');
      await user.click(within(confirmModal!).getByRole('button', { name: /^Delete$/i }));
      
      expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
    });

    it('shows success toast on delete', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      // Add and delete
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'X');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Y');
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      
      const deleteBtn = screen.getByText('×');
      await user.click(deleteBtn);
      
      const confirmModal = screen.getByText('Delete Card?').closest('div');
      await user.click(within(confirmModal!).getByRole('button', { name: /^Delete$/i }));
      
      expect(screen.getByText('Card deleted')).toBeInTheDocument();
    });

    it('cancels delete when needed', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      // Add card
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'Keep Me');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Desc');
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      
      // Start delete but cancel
      const deleteBtn = screen.getByText('×');
      await user.click(deleteBtn);
      
      const confirmModal = screen.getByText('Delete Card?').closest('div');
      await user.click(within(confirmModal!).getByRole('button', { name: /^Cancel$/i }));
      
      expect(screen.getByText('Keep Me')).toBeInTheDocument();
    });
  });

  describe('localStorage Persistence', () => {
    it('persists cards to localStorage', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'Save Me');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Persistent');
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      
      const stored = loadCards();
      expect(stored.length).toBe(1);
      expect(stored[0].title).toBe('Save Me');
    });

    it('loads persisted cards on remount', async () => {
      const user = userEvent.setup();
      const { unmount } = render(<TaskBoard />);
      
      // Add card
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'Persist');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Load');
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      
      unmount();
      render(<TaskBoard />);
      
      expect(screen.getByText('Persist')).toBeInTheDocument();
    });

    it('removes from storage on delete', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      // Add
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'X');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'Y');
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      
      let stored = loadCards();
      expect(stored.length).toBe(1);
      
      // Delete
      const deleteBtn = screen.getByText('×');
      await user.click(deleteBtn);
      
      const confirmModal = screen.getByText('Delete Card?').closest('div');
      await user.click(within(confirmModal!).getByRole('button', { name: /^Delete$/i }));
      
      stored = loadCards();
      expect(stored.length).toBe(0);
    });
  });

  describe('Modal Behavior', () => {
    it('closes modal on cancel', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      await user.click(screen.getByText('+ Add Card'));
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /cancel/i }));
      
      expect(screen.queryByText('Add New Card')).not.toBeInTheDocument();
    });

    it('clears form after submission', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      // Add card
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), 'Card1');
      await user.type(screen.getByPlaceholderText('Enter card description'), 'D1');
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      
      // Reopen
      await user.click(screen.getByText('+ Add Card'));
      
      const titleInput = screen.getByPlaceholderText('Enter card title') as HTMLInputElement;
      const bodyInput = screen.getByPlaceholderText('Enter card description') as HTMLTextAreaElement;
      
      expect(titleInput.value).toBe('');
      expect(bodyInput.value).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('handles maximum length content', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      const maxTitle = 'a'.repeat(100);
      const maxBody = 'b'.repeat(500);
      
      await user.click(screen.getByText('+ Add Card'));
      await user.type(screen.getByPlaceholderText('Enter card title'), maxTitle);
      await user.type(screen.getByPlaceholderText('Enter card description'), maxBody);
      const modal = screen.getByText('Add New Card').closest('div');
      await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      
      expect(screen.getByText(maxTitle)).toBeInTheDocument();
      expect(screen.getByText(maxBody)).toBeInTheDocument();
    });

    it('handles rapid additions', async () => {
      const user = userEvent.setup();
      render(<TaskBoard />);
      
      for (let i = 1; i <= 3; i++) {
        await user.click(screen.getByText('+ Add Card'));
        await user.type(screen.getByPlaceholderText('Enter card title'), `Card${i}`);
        await user.type(screen.getByPlaceholderText('Enter card description'), `Desc${i}`);
        const modal = screen.getByText('Add New Card').closest('div');
        await user.click(within(modal!).getByRole('button', { name: /add card/i }));
      }
      
      expect(screen.getByText('Card1')).toBeInTheDocument();
      expect(screen.getByText('Card2')).toBeInTheDocument();
      expect(screen.getByText('Card3')).toBeInTheDocument();
      
      const stored = loadCards();
      expect(stored.length).toBe(3);
    });
  });
});
