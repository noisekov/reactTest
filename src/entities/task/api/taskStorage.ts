import initialTasks from "../model/initialTasks.json";
import { isTaskStatus } from "../model/task.types";
import type { Task } from "../model/task.types";
import { TASK_STORAGE_KEY } from "../model/task.constants";

export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTask(value: unknown): value is Task {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "number" &&
    Number.isFinite(value.id) &&
    isTaskStatus(value.type) &&
    typeof value.startDay === "number" &&
    Number.isFinite(value.startDay) &&
    typeof value.endDay === "number" &&
    Number.isFinite(value.endDay) &&
    typeof value.text === "string"
  );
}

function isTaskList(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}

const seedTasks: Task[] = isTaskList(initialTasks) ? initialTasks : [];

function getBrowserStorage(): StoragePort | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function loadTasks(
  storage: StoragePort | null = getBrowserStorage(),
): Task[] {
  if (!storage) return [...seedTasks];

  try {
    const serializedTasks = storage.getItem(TASK_STORAGE_KEY);
    if (serializedTasks === null) return [...seedTasks];

    const parsedTasks: unknown = JSON.parse(serializedTasks);
    return isTaskList(parsedTasks) ? parsedTasks : [...seedTasks];
  } catch {
    return [...seedTasks];
  }
}

export function saveTasks(
  tasks: Task[],
  storage: StoragePort | null = getBrowserStorage(),
): void {
  if (!storage) return;

  try {
    storage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Например, браузер запретил storage или закончилось доступное место.
  }
}
