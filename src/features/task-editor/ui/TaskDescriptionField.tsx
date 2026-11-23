import { TASK_DESCRIPTION_MAX_LENGTH } from '@/entities/task/model/task.constants';
import styles from './TaskEditorForm.module.scss';

interface TaskDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

function TaskDescriptionField({ value, onChange, error }: TaskDescriptionFieldProps) {
  return (
    <label className={styles.field} htmlFor="task-description">
      <span className={styles.label}>Описание:</span>
      <span className={styles.descriptionControl}>
        <input
          className={styles.input}
          id="task-description"
          type="text"
          required
          maxLength={TASK_DESCRIPTION_MAX_LENGTH}
          value={value}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'task-description-error' : undefined}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Что нужно сделать?"
        />
        {error && <small id="task-description-error" className={styles.fieldError}>{error}</small>}
      </span>
    </label>
  );
}

export default TaskDescriptionField;
