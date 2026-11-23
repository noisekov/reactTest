import type { TaskColumnConfig } from './task.types';

export const TASK_COLUMNS: readonly TaskColumnConfig[] = [
  { id: 'todo', title: 'To Do', icon: 'todo' },
  { id: 'in_progress', title: 'In Progress', icon: 'progress' },
  { id: 'review', title: 'Review', icon: 'review' },
  { id: 'done', title: 'Done', icon: 'done' }
];

export const TASK_STORAGE_KEY = 'react-test-kanban-tasks';
export const TASK_DESCRIPTION_MAX_LENGTH = 240;
