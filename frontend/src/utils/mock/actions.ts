export interface Action {
  id: number;
  status: 'Open' | 'In Progress' | 'Completed';
}

export const actions: Action[] = [
  { id: 1, status: 'Open' },
  { id: 2, status: 'In Progress' },
  { id: 3, status: 'Completed' },
  { id: 4, status: 'Completed' },
  { id: 5, status: 'Open' },
];

