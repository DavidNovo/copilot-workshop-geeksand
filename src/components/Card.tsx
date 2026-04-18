import React, { useState } from 'react';
import type { Card } from '../types';

interface CardComponentProps {
  card: Card;
  isDragging: boolean;
  onDelete: (cardId: string) => void;
  onDragStart: (e: React.DragEvent) => void;
}

export function CardComponent({ card, isDragging, onDelete, onDragStart }: CardComponentProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(card.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        draggable
        onDragStart={onDragStart}
        className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-grab active:cursor-grabbing transition-all border-l-4 border-blue-500 ${
          isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 break-words">{card.title}</h3>
            <p className="text-gray-600 text-sm mt-2 break-words">{card.body}</p>
          </div>
          <button
            onClick={handleDeleteClick}
            className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700 text-lg font-bold transition"
            title="Delete card"
          >
            ×
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-3">{new Date(card.createdAt).toLocaleDateString()}</p>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <h3 className="text-xl font-bold mb-4">Delete Card?</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this card? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 rounded-lg font-medium bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
