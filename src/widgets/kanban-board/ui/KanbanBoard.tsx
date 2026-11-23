import { useMemo, useState } from 'react';
import type { Task, TaskDraft, TaskStatus } from '@/entities/task/model/task.types';
import { TASK_COLUMNS } from '@/entities/task/model/task.constants';
import { selectTasksByStatus } from '@/entities/task/model/task.utils';
import TaskColumn from './TaskColumn';
import styles from './KanbanBoard.module.scss';

interface KanbanBoardProps {
  tasks: Task[];
  totalTasks: number;
  editingTaskId: number | null;
  creatingStatus: TaskStatus | null;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onCreateTask: (status: TaskStatus) => void;
  onMoveTask: (taskId: number, status: TaskStatus) => void;
  onCancelEditor: () => void;
  onSaveTask: (task: Task | null, draft: TaskDraft) => void;
}

function KanbanBoard({
  tasks,
  totalTasks,
  editingTaskId,
  creatingStatus,
  onEditTask,
  onDeleteTask,
  onCreateTask,
  onMoveTask,
  onCancelEditor,
  onSaveTask
}: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const tasksByColumn = useMemo(() => {
    const groupedTasks: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: []
    };

    TASK_COLUMNS.forEach((column) => {
      groupedTasks[column.id] = selectTasksByStatus(tasks, column.id);
    });

    return groupedTasks;
  }, [tasks]);

  const handleTaskDrop = (taskId: number, status: TaskStatus) => {
    if (taskId === editingTaskId) return;
    onMoveTask(taskId, status);
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  return (
    <>
      <section className={styles.board} aria-label="Канбан-доска задач">
        {TASK_COLUMNS.map((column) => (
          <TaskColumn
            key={column.id}
            column={column}
            tasks={tasksByColumn[column.id]}
            isDragOver={dragOverColumn === column.id}
            draggedTask={draggedTask}
            editingTaskId={editingTaskId}
            isCreating={creatingStatus === column.id}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onAdd={() => onCreateTask(column.id)}
            onCancelEditor={onCancelEditor}
            onSaveTask={onSaveTask}
            onTaskDragStart={setDraggedTask}
            onTaskDragEnd={() => {
              setDraggedTask(null);
              setDragOverColumn(null);
            }}
            onTaskDrop={handleTaskDrop}
            onDragOverColumn={setDragOverColumn}
          />
        ))}
      </section>
      <footer className={styles.footer}>
        <span>{tasks.length} из {totalTasks} задач</span>
        <span>
          {editingTaskId !== null || creatingStatus !== null
            ? 'Сохраните изменения или отмените редактирование'
            : draggedTask !== null
              ? 'Перетащите задачу в нужную колонку'
              : 'Нажмите на карточку, чтобы изменить задачу'}
        </span>
      </footer>
    </>
  );
}

export default KanbanBoard;
