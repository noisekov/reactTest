import type { Task } from "../../../entities/task/model/task.types";
import { toDateInputValue } from "../../../entities/task/model/task.utils";

function parseDateQuery(query: string): string | null {
  const match = query.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const isValid =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  return isValid ? `${year}-${month}-${day}` : "invalid-date";
}

export function filterTasks(tasks: readonly Task[], rawQuery: string): Task[] {
  const query = rawQuery.trim().toLocaleLowerCase("ru-RU");
  if (!query) return [...tasks];

  const dateQuery = parseDateQuery(query);
  if (dateQuery !== null) {
    if (dateQuery === "invalid-date") return [];

    return tasks.filter(
      (task) =>
        toDateInputValue(task.startDay) === dateQuery ||
        toDateInputValue(task.endDay) === dateQuery,
    );
  }

  return tasks.filter((task) =>
    task.text.toLocaleLowerCase("ru-RU").includes(query),
  );
}
