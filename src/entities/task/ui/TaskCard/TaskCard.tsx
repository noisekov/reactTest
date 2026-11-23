import type { DragEvent, ReactNode } from 'react';
import type { Task } from '@/entities/task/model/task.types';
import { isOverdue } from '@/entities/task/model/task.utils';
import TaskCardMeta from './TaskCardMeta';
import TaskCardDescription from './TaskCardDescription';
import styles from './TaskCard.module.scss';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragging: boolean;
  actions?: ReactNode;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
}

function TaskCard({ task, onEdit, isDragging, actions, onDragStart, onDragEnd }: TaskCardProps) {
  const overdue = isOverdue(task);

  const handleDragStart = (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(task.id));
    const cardBounds = event.currentTarget.getBoundingClientRect();
    event.dataTransfer.setDragImage(
      event.currentTarget,
      Math.min(40, cardBounds.width / 2),
      Math.min(24, cardBounds.height / 2)
    );
    onDragStart(task);
  };

  return (
    <article
      className={[
        'task-card',
        styles.card,
        overdue ? styles.overdue : '',
        isDragging ? styles.dragging : ''
      ].filter(Boolean).join(' ')}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      aria-grabbed={isDragging}
    >
      <button
        className={styles.content}
        type="button"
        onClick={() => onEdit(task)}
        aria-label={`Редактировать задачу: ${task.text}`}
      >
        <TaskCardMeta label="Начало:" timestamp={task.startDay} />
        <TaskCardMeta label="Окончание:" timestamp={task.endDay} />
        <TaskCardDescription text={task.text} />
      </button>
      {actions && <div className={styles.actions}>{actions}</div>}
    </article>
  );
}

export default TaskCard;
