import { useCallback, useEffect, useReducer } from 'react';
import { loadTasks, saveTasks } from '@/entities/task/api/taskStorage';
import { tasksReducer } from '@/entities/task/model/task.reducer';
import type { TaskDraft, TaskStatus } from '@/entities/task/model/task.types';

/** Application hook: предоставляет экрану сценарии работы с задачами. */
export function useTaskBoard() {
  const [tasks, dispatch] = useReducer(tasksReducer, undefined, loadTasks);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const createTask = useCallback((draft: TaskDraft) => {
    dispatch({ type: 'task/created', payload: draft });
  }, []);

  const updateTask = useCallback((id: number, changes: TaskDraft) => {
    dispatch({ type: 'task/updated', payload: { id, changes } });
  }, []);

  const deleteTask = useCallback((id: number) => {
    dispatch({ type: 'task/deleted', payload: { id } });
  }, []);

  const moveTask = useCallback((id: number, status: TaskStatus) => {
    dispatch({ type: 'task/moved', payload: { id, status } });
  }, []);

  return { tasks, createTask, updateTask, deleteTask, moveTask };
}
