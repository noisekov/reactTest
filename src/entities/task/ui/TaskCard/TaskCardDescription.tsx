import styles from './TaskCard.module.scss';

interface TaskCardDescriptionProps {
  text: string;
}

function TaskCardDescription({ text }: TaskCardDescriptionProps) {
  return (
    <div className={styles.description}>
      <span>Описание:</span>
      <strong>{text}</strong>
    </div>
  );
}

export default TaskCardDescription;
