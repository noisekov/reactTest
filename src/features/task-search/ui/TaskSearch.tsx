import Icon from '@/shared/ui/Icon/Icon';
import styles from './TaskSearch.module.scss';

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
}

function TaskSearch({ value, onChange }: TaskSearchProps) {
  return (
    <div className={styles.search}>
      <Icon name="search" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="поиск..."
        aria-label="Поиск задач по описанию или дате"
      />
      {value && (
        <button
          className={styles.clearButton}
          type="button"
          onClick={() => onChange('')}
          aria-label="Очистить поиск"
        >
          <Icon name="close" />
        </button>
      )}
    </div>
  );
}

export default TaskSearch;
