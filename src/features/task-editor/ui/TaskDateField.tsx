import styles from './TaskEditorForm.module.scss';

interface TaskDateFieldProps {
  id: string;
  label: string;
  value: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
}

function TaskDateField({ id, label, value, autoFocus = false, onChange }: TaskDateFieldProps) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <input
        className={styles.dateInput}
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        maxLength={10}
        autoFocus={autoFocus}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="дд.мм.гггг"
        aria-label={label.replace(':', '')}
      />
    </label>
  );
}

export default TaskDateField;
