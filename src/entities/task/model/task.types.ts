export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export const TASK_STATUSES: readonly TaskStatus[] = [
  'todo',
  'in_progress',
  'review',
  'done'
];

export function isTaskStatus(value: unknown): value is TaskStatus {
  return TASK_STATUSES.some((status) => status === value);
}

export interface Task {
  /** Уникальный идентификатор задачи. */
  id: number;
  /** Текущий статус задачи. */
  type: TaskStatus;
  /** Timestamp начала задачи в миллисекундах. */
  startDay: number;
  /** Timestamp дедлайна в миллисекундах. */
  endDay: number;
  /** Описание задачи. */
  text: string;
}

export type TaskDraft = Omit<Task, 'id'>;

export interface TaskColumnConfig {
  id: TaskStatus;
  title: string;
  icon: 'todo' | 'progress' | 'review' | 'done';
}
