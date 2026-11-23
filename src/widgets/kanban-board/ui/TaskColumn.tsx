import { Fragment } from 'react';
import type { DragEvent } from 'react';
import type { Task, TaskDraft, TaskColumnConfig } from '@/entities/task/model/task.types';
import TaskCard from '@/entities/task/ui/TaskCard/TaskCard';
import TaskCardMeta from '@/entities/task/ui/TaskCard/TaskCardMeta';
import TaskCardDescription from '@/entities/task/ui/TaskCard/TaskCardDescription';
import TaskEditorForm from '@/features/task-editor/ui/TaskEditorForm';
import DeleteTaskButton from '@/features/task-delete/ui/DeleteTaskButton';
import EditTaskButton from '@/features/task-edit/ui/EditTaskButton';
import AddTaskButton from '@/features/task-create/ui/AddTaskButton';
import Icon from '@/shared/ui/Icon/Icon';
import styles from './TaskColumn.module.scss';

interface TaskColumnProps {
  column: TaskColumnConfig;
  tasks: Task[];
  isDragOver: boolean;
  draggedTask: Task | null;
  editingTaskId: number | null;
  isCreating: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onAdd: () => void;
  onCancelEditor: () => void;
  onSaveTask: (task: Task | null, draft: TaskDraft) => void;
  onTaskDragStart: (task: Task) => void;
  onTaskDragEnd: () => void;
  onTaskDrop: (taskId: number, status: TaskColumnConfig['id']) => void;
  onDragOverColumn: (status: TaskColumnConfig['id'] | null) => void;
}

function TaskColumn({
  column,
  tasks,
  isDragOver,
  draggedTask,
  editingTaskId,
  isCreating,
  onEdit,
  onDelete,
  onAdd,
  onCancelEditor,
  onSaveTask,
  onTaskDragStart,
  onTaskDragEnd,
  onTaskDrop,
  onDragOverColumn
}: TaskColumnProps) {
  const showDropPreview = Boolean(
    isDragOver && draggedTask && draggedTask.type !== column.id && draggedTask.id !== editingTaskId
  );
  const previewIndex = showDropPreview && draggedTask
    ? tasks.findIndex((task) =>
        task.startDay > draggedTask.startDay ||
        (task.startDay === draggedTask.startDay && task.id > draggedTask.id)
      )
    : -1;

  const dropPreview = showDropPreview && draggedTask ? (
    <div
      key="drop-preview"
      className={styles.dropPreview}
      role="status"
      aria-label={`Переместить задачу: ${draggedTask.text}`}
    >
      <span className={styles.dropPreviewHint}>Переместить сюда</span>
      <TaskCardMeta label="Начало:" timestamp={draggedTask.startDay} />
      <TaskCardMeta label="Окончание:" timestamp={draggedTask.endDay} />
      <TaskCardDescription text={draggedTask.text} />
    </div>
  ) : null;

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    onDragOverColumn(column.id);
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const rawTaskId = event.dataTransfer.getData('text/plain');
    const taskId = Number(rawTaskId);

    if (rawTaskId && Number.isSafeInteger(taskId)) {
      onTaskDrop(taskId, column.id);
    }

    onDragOverColumn(null);
  };

  return (
    <section
      className={`${styles.column} ${isDragOver ? styles.dragOver : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={(event) => {
        const relatedTarget = event.relatedTarget;
        if (!(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget)) {
          onDragOverColumn(null);
        }
      }}
      onDrop={handleDrop}
      aria-label={`Колонка ${column.title}`}
    >
      <header className={styles.header}>
        <h2>
          <Icon name={column.icon} />
          {column.title}
          <span className={styles.count}>{tasks.length + (isCreating ? 1 : 0)}</span>
        </h2>

        {column.id === 'todo' && (
          <AddTaskButton
            onClick={onAdd}
            disabled={isCreating || editingTaskId !== null}
          />
        )}
      </header>

      <div className={styles.cards}>
        {tasks.map((task, index) => (
          <Fragment key={task.id}>
            {previewIndex === index && dropPreview}
            {task.id === editingTaskId ? (
              <TaskEditorForm
                task={task}
                initialStatus={column.id}
                onCancel={onCancelEditor}
                onSubmit={(draft) => onSaveTask(task, draft)}
              />
            ) : (
              <TaskCard
                task={task}
                onEdit={onEdit}
                isDragging={draggedTask?.id === task.id}
                actions={
                  <>
                    <EditTaskButton task={task} onEdit={onEdit} />
                    <DeleteTaskButton taskId={task.id} onDelete={onDelete} />
                  </>
                }
                onDragStart={onTaskDragStart}
                onDragEnd={onTaskDragEnd}
              />
            )}
          </Fragment>
        ))}

        {previewIndex === -1 && dropPreview}

        {isCreating && (
          <TaskEditorForm
            task={null}
            initialStatus={column.id}
            onCancel={onCancelEditor}
            onSubmit={(draft) => onSaveTask(null, draft)}
          />
        )}

        {tasks.length === 0 && !isCreating && !showDropPreview && (
          <div className={styles.emptyState}>Нет задач</div>
        )}
      </div>
    </section>
  );
}

export default TaskColumn;
