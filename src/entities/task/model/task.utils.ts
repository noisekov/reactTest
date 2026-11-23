import type { Task, TaskStatus } from './task.types';

/** Возвращает timestamp начала локального календарного дня. */
export function getStartOfDay(timestamp: number): number {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Задача просрочена, если её дедлайн раньше сегодняшнего календарного дня.
 * Завершённые задачи никогда не считаются просроченными.
 */
export function isOverdue(
  task: Pick<Task, 'endDay' | 'type'>,
  now: number = Date.now()
): boolean {
  return task.type !== 'done' && getStartOfDay(task.endDay) < getStartOfDay(now);
}

/** Форматирует timestamp в dd.mm.yyyy с учётом локального часового пояса. */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

/** Проверяет dd.mm.yyyy и возвращает timestamp локальной полуночи. */
export function parseDisplayDate(value: string): number | null {
  const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const isValid =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  return isValid ? date.getTime() : null;
}

/** Сериализует дату в yyyy-mm-dd для сопоставления в поиске. */
export function toDateInputValue(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Сортировка по дате начала, не мутирует исходный массив. */
export function sortTasksByStartDay(tasks: readonly Task[]): Task[] {
  return [...tasks].sort(
    (first, second) => first.startDay - second.startDay || first.id - second.id
  );
}

/** Возвращает список задач конкретного статуса в заданном порядке. */
export function selectTasksByStatus(
  tasks: readonly Task[],
  status: TaskStatus
): Task[] {
  return sortTasksByStartDay(tasks.filter((task) => task.type === status));
}
