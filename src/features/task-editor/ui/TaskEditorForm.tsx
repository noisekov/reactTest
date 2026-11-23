import { useState, type FormEvent } from 'react';
import type { Task, TaskDraft, TaskStatus } from '@/entities/task/model/task.types';
import { formatDate, parseDisplayDate } from '@/entities/task/model/task.utils';
import Button from '@/shared/ui/Button/Button';
import Icon from '@/shared/ui/Icon/Icon';
import TaskDateField from './TaskDateField';
import TaskDescriptionField from './TaskDescriptionField';
import styles from './TaskEditorForm.module.scss';

interface TaskEditorFormProps {
  task: Task | null;
  initialStatus: TaskStatus;
  onCancel: () => void;
  onSubmit: (draft: TaskDraft) => void;
}

function getTodayDate(): string {
  return formatDate(Date.now());
}

function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatDate(tomorrow.getTime());
}

function TaskEditorForm({ task, initialStatus, onCancel, onSubmit }: TaskEditorFormProps) {
  const [text, setText] = useState(task?.text ?? '');
  const [startDate, setStartDate] = useState(
    task ? formatDate(task.startDay) : getTodayDate()
  );
  const [endDate, setEndDate] = useState(
    task ? formatDate(task.endDay) : getTomorrowDate()
  );
  const [dateError, setDateError] = useState('');
  const [textError, setTextError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedText = text.trim();
    const startTimestamp = parseDisplayDate(startDate);
    const endTimestamp = parseDisplayDate(endDate);

    if (!normalizedText) {
      setTextError('Добавь описание задачи.');
      return;
    }

    setTextError('');

    if (startTimestamp === null || endTimestamp === null) {
      setDateError('Укажи даты в формате дд.мм.гггг.');
      return;
    }

    if (endTimestamp < startTimestamp) {
      setDateError('Дедлайн не может быть раньше даты начала.');
      return;
    }

    setDateError('');
    const draft: TaskDraft = {
      type: task?.type ?? initialStatus,
      startDay: startTimestamp,
      endDay: endTimestamp,
      text: normalizedText
    };

    onSubmit(draft);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} aria-label={task ? 'Редактирование задачи' : 'Создание задачи'}>
      <TaskDateField
        id="task-start-date"
        label="Начало:"
        value={startDate}
        autoFocus
        onChange={(value) => {
          setStartDate(value);
          setDateError('');
        }}
      />
      <TaskDateField
        id="task-end-date"
        label="Окончание:"
        value={endDate}
        onChange={(value) => {
          setEndDate(value);
          setDateError('');
        }}
      />
      <TaskDescriptionField
        value={text}
        error={textError}
        onChange={(value) => {
          setText(value);
          if (value.trim()) setTextError('');
        }}
      />

      {dateError && <p className={styles.error} role="alert">{dateError}</p>}

      <footer className={styles.actions}>
        <Button
          className={styles.iconAction}
          type="button"
          onClick={onCancel}
          aria-label="Отменить редактирование"
          title="Отмена"
        >
          <Icon name="close" />
        </Button>
        <Button
          className={`${styles.iconAction} ${styles.saveAction}`}
          type="submit"
          aria-label="Сохранить задачу"
          title="Сохранить"
        >
          <Icon name="check" />
        </Button>
      </footer>
    </form>
  );
}

export default TaskEditorForm;
