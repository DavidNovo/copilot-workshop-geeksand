import type { Card } from './types';

const STORAGE_KEY = 'taskboard_cards';

export function loadCards(): Card[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cards from localStorage:', error);
    return [];
  }
}

export function saveCards(cards: Card[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Error saving cards to localStorage:', error);
    throw new Error('Error saving card');
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
