export interface Card {
  id: string;
  title: string;
  body: string;
  columnId: 'todo' | 'in-progress' | 'complete';
  createdAt: string;
}

export type ColumnId = 'todo' | 'in-progress' | 'complete';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
