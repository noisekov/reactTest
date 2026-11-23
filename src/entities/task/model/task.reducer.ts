import type { Task, TaskDraft, TaskStatus } from './task.types';

export type TaskAction =
  | { type: 'task/created'; payload: TaskDraft }
  | { type: 'task/updated'; payload: { id: number; changes: TaskDraft } }
  | { type: 'task/deleted'; payload: { id: number } }
  | { type: 'task/moved'; payload: { id: number; status: TaskStatus } };

/** Чистый reducer: все операции возвращают новое состояние без мутаций. */
export function tasksReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'task/created': {
      const nextId = state.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;
      return [...state, { ...action.payload, id: nextId }];
    }

    case 'task/updated':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.changes }
          : task
      );

    case 'task/deleted':
      return state.filter((task) => task.id !== action.payload.id);

    case 'task/moved':
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, type: action.payload.status }
          : task
      );

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
