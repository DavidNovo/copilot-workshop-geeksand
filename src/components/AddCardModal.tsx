import React, { useState } from 'react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, body: string) => void;
}

export function AddCardModal({ isOpen, onClose, onSubmit }: AddCardModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const validate = () => {
    const newErrors: { title?: string; body?: string } = {};

    if (!title.trim() || title.trim().length === 0 || title.length > 100) {
      newErrors.title = 'Title is required and must be under 100 characters';
    }

    if (!body.trim() || body.trim().length === 0 || body.length > 500) {
      newErrors.body = 'Body is required and must be under 500 characters';
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      onSubmit(title.trim(), body.trim());
      setTitle('');
      setBody('');
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handleClose = () => {
    setTitle('');
    setBody('');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const isValid = title.trim().length > 0 && title.length <= 100 && body.trim().length > 0 && body.length <= 500;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Card</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter card title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            <p className="text-gray-500 text-xs mt-1">{title.length}/100</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              maxLength={500}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.body ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="Enter card description"
              rows={4}
            />
            {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body}</p>}
            <p className="text-gray-500 text-xs mt-1">{body.length}/500</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!isValid}
              className={`flex-1 py-2 rounded-lg font-medium transition ${
                isValid
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add Card
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 rounded-lg font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
