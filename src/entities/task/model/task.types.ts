export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export const TASK_STATUSES: readonly TaskStatus[] = [
  "todo",
  "in_progress",
  "review",
  "done",
];

export function isTaskStatus(value: unknown): value is TaskStatus {
  return TASK_STATUSES.some((status) => status === value);
}

export interface Task {
  id: number;
  type: TaskStatus;
  startDay: number;
  endDay: number;
  text: string;
}

export type TaskDraft = Omit<Task, "id">;

export interface TaskColumnConfig {
  id: TaskStatus;
  title: string;
  icon: "todo" | "progress" | "review" | "done";
}
