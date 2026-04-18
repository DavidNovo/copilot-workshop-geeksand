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

  // Save cards to localStorage whenever they change
  useEffect(() => {
    saveCards(cards);
  }, [cards]);

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

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('cardId', cardId);
  };

  const handleDrop = (e: React.DragEvent, columnId: 'todo' | 'in-progress' | 'complete') => {
    e.preventDefault();

    if (!draggedCardId) return;

    // Find the card and update its column
    setCards((prev) =>
      prev.map((card) =>
        card.id === draggedCardId
          ? { ...card, columnId }
          : card
      )
    );

    setDraggedCardId(null);
    addToast('Card moved', 'success');
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
            onDelete={handleDeleteCard}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
          <Column
            title="In Progress"
            columnId="in-progress"
            cards={inProgressCards}
            draggedCardId={draggedCardId}
            onDelete={handleDeleteCard}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
          <Column
            title="Complete"
            columnId="complete"
            cards={completeCards}
            draggedCardId={draggedCardId}
            onDelete={handleDeleteCard}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        </div>
      </div>

      {/* Modal and Toasts */}
      <AddCardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddCard} />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
