import React from 'react';
import type { Card } from '../types';
import { CardComponent } from './Card';

interface ColumnProps {
  title: string;
  columnId: 'todo' | 'in-progress' | 'complete';
  cards: Card[];
  onDelete: (cardId: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, columnId: 'todo' | 'in-progress' | 'complete') => void;
}

export function Column({ title, columnId, cards, onDelete, onDragStart, onDragOver, onDrop }: ColumnProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, columnId)}
      className="flex-1 min-h-96 bg-gray-100 rounded-lg p-4 border-2 border-gray-300 hover:border-gray-400 transition"
    >
      <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>

      <div className="space-y-3">
        {cards.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p className="text-sm">No cards yet</p>
            <p className="text-xs mt-1">Drag cards here or create a new one</p>
          </div>
        ) : (
          cards.map((card) => (
            <CardComponent
              key={card.id}
              card={card}
              onDelete={onDelete}
              onDragStart={(e) => onDragStart(e, card.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
