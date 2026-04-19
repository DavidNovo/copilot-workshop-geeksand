import React, { useState, useEffect } from 'react';
import type { Card, Toast } from '../types';
import { loadCards, saveCards, generateId } from '../storage';
import { AddCardModal } from './AddCardModal';
import { Column } from './Column';
import { ToastContainer } from './Toast';

export function TaskBoard() {
  const [cards, setCards] = useState<Card[]>(() => loadCards());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    try {
      saveCards(cards);
    } catch (error) {
      console.error('Failed to persist cards:', error);
      addToast('Failed to save changes', 'error');
    }
  }, [cards]);

  // Reset drag state when tab becomes hidden mid-drag
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && draggedCardId) {
        console.warn('[DragDrop] Tab hidden during drag — resetting state');
        setDraggedCardId(null);
        setDragOverIndex(null);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [draggedCardId]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = generateId();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleAddCard = (title: string, body: string) => {
    const newCard: Card = {
      id: generateId(),
      title,
      body,
      columnId: 'todo',
      createdAt: new Date().toISOString(),
    };

    setCards((prev) => [...prev, newCard]);
    setIsModalOpen(false);
    addToast('Card added', 'success');
  };

  const handleDeleteCard = (cardId: string) => {
    setCards((prev) => prev.filter((card) => card.id !== cardId));
    addToast('Card deleted', 'success');
  };

  const VALID_COLUMN_IDS = ['todo', 'in-progress', 'complete'] as const;

  const isValidColumnId = (id: string): id is 'todo' | 'in-progress' | 'complete' =>
    (VALID_COLUMN_IDS as readonly string[]).includes(id);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    if (isModalOpen) {
      console.warn('[DragDrop] Drag prevented: modal is open');
      e.preventDefault();
      return;
    }
    if (draggedCardId) {
      console.warn('[DragDrop] Drag prevented: another drag already in progress');
      e.preventDefault();
      return;
    }
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDragEnd = () => {
    if (draggedCardId) {
      console.warn('[DragDrop] Drag cancelled without drop — resetting state');
    }
    setDraggedCardId(null);
    setDragOverIndex(null);
  };

  const moveCardToColumn = (cardId: string, targetColumnId: 'todo' | 'in-progress' | 'complete') => {
    // Validate card ID
    const cardToMove = cards.find((card) => card.id === cardId);
    if (!cardToMove) {
      addToast('Error: Card not found', 'error');
      return;
    }

    // Check if dropped on same column - no-op
    if (cardToMove.columnId === targetColumnId) {
      addToast('Card already in this column', 'info');
      return;
    }

    // Move the card to the target column
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId
          ? { ...card, columnId: targetColumnId }
          : card
      )
    );

    addToast('Card moved', 'success');
  };

  const handleCardDragOver = (cardId: string, cardIndex: number, columnId: 'todo' | 'in-progress' | 'complete') => {
    // Only track reordering within same column
    const draggedCard = cards.find((c) => c.id === draggedCardId);
    if (draggedCard && draggedCard.columnId === columnId && draggedCard.id !== cardId) {
      setDragOverIndex(cardIndex);
    }
  };

  const reorderCardsInColumn = (cardId: string, targetIndex: number, columnId: 'todo' | 'in-progress' | 'complete') => {
    // Get all cards in this column
    const columnCards = cards.filter((c) => c.columnId === columnId);
    const sourceIndex = columnCards.findIndex((c) => c.id === cardId);

    // No reordering if dropping on same position
    if (sourceIndex === targetIndex || sourceIndex === targetIndex - 1) {
      addToast('Card reordered', 'info');
      return;
    }

    // Create new array with reordered cards
    const newColumnCards = [...columnCards];
    const [movedCard] = newColumnCards.splice(sourceIndex, 1);
    newColumnCards.splice(targetIndex > sourceIndex ? targetIndex - 1 : targetIndex, 0, movedCard);

    // Update cards array while preserving order of other columns
    const otherCards = cards.filter((c) => c.columnId !== columnId);
    const reorderedCards = [...otherCards, ...newColumnCards];

    setCards(reorderedCards);
    addToast('Card reordered', 'success');
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();

    if (!isValidColumnId(columnId)) {
      console.warn(`[DragDrop] Invalid target column ID: ${columnId}`);
      addToast('Error: Invalid drop target', 'error');
      setDraggedCardId(null);
      setDragOverIndex(null);
      return;
    }

    const cardId = draggedCardId ?? e.dataTransfer.getData('cardId');
    if (!cardId) {
      console.warn('[DragDrop] Drop event with no card ID');
      addToast('Error: No card selected', 'error');
      setDragOverIndex(null);
      return;
    }

    const card = cards.find((c) => c.id === cardId);
    if (!card) {
      console.warn(`[DragDrop] Card ID not found: ${cardId}`);
      addToast('Error: Card not found', 'error');
      setDraggedCardId(null);
      setDragOverIndex(null);
      return;
    }

    if (card.columnId === columnId && dragOverIndex !== null) {
      reorderCardsInColumn(cardId, dragOverIndex, columnId);
    } else {
      moveCardToColumn(cardId, columnId);
    }

    setDraggedCardId(null);
    setDragOverIndex(null);
  };

  const todoCards = cards.filter((card) => card.columnId === 'todo');
  const inProgressCards = cards.filter((card) => card.columnId === 'in-progress');
  const completeCards = cards.filter((card) => card.columnId === 'complete');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Task Board</h1>
            <p className="text-gray-600 mt-2">Organize your tasks across different workflow stages</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition shadow-md"
          >
            + Add Card
          </button>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Column
            title="Todo"
            columnId="todo"
            cards={todoCards}
            draggedCardId={draggedCardId}
            dragOverIndex={dragOverIndex}
            onDelete={handleDeleteCard}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onCardDragOver={handleCardDragOver}
          />
          <Column
            title="In Progress"
            columnId="in-progress"
            cards={inProgressCards}
            draggedCardId={draggedCardId}
            dragOverIndex={dragOverIndex}
            onDelete={handleDeleteCard}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onCardDragOver={handleCardDragOver}
          />
          <Column
            title="Complete"
            columnId="complete"
            cards={completeCards}
            draggedCardId={draggedCardId}
            dragOverIndex={dragOverIndex}
            onDelete={handleDeleteCard}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            onCardDragOver={handleCardDragOver}
          />
        </div>
      </div>

      {/* Modal and Toasts */}
      <AddCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddCard} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
