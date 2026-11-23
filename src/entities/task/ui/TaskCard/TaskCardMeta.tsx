import { formatDate } from '@/entities/task/model/task.utils';
import styles from './TaskCard.module.scss';

interface TaskCardMetaProps {
  label: string;
  timestamp: number;
}

function TaskCardMeta({ label, timestamp }: TaskCardMetaProps) {
  return (
    <div className={styles.metaRow}>
      <span>{label}</span>
      <time dateTime={new Date(timestamp).toISOString()}>{formatDate(timestamp)}</time>
    </div>
  );
}

export default TaskCardMeta;
