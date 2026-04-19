import React, { useState } from 'react';
import type { Card } from '../types';
import { CardComponent } from './Card';

interface ColumnProps {
  title: string;
  columnId: 'todo' | 'in-progress' | 'complete';
  cards: Card[];
  draggedCardId: string | null;
  dragOverIndex: number | null;
  onDelete: (cardId: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onDrop: (e: React.DragEvent, columnId: 'todo' | 'in-progress' | 'complete') => void;
  onCardDragOver: (cardId: string, cardIndex: number, columnId: 'todo' | 'in-progress' | 'complete') => void;
}

export function Column({ title, columnId, cards, draggedCardId, dragOverIndex, onDelete, onDragStart, onDrop, onCardDragOver }: ColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only remove highlight if leaving the column entirely
    if (e.currentTarget === e.target) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDrop(e, columnId);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-h-96 bg-gray-100 rounded-lg p-4 border-2 transition ${ isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>

      <div className="space-y-3">
        {cards.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">No cards yet</p>
            <p className="text-xs mt-1">Drag cards here or create a new one</p>
          </div>
        ) : (
          cards.map((card, cardIndex) => (
            <div key={card.id}>
              {dragOverIndex === cardIndex && (
                <div className="h-1 bg-blue-400 rounded mb-2"></div>
              )}
              <CardComponent
                card={card}
                isDragging={draggedCardId === card.id}
                onDelete={onDelete}
                onDragStart={(e) => onDragStart(e, card.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  onCardDragOver(card.id, cardIndex, columnId);
                }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
