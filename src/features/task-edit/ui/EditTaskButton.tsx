import type { Task } from '@/entities/task/model/task.types';
import IconButton from '@/shared/ui/IconButton/IconButton';

interface EditTaskButtonProps {
  task: Task;
  onEdit: (task: Task) => void;
}

function EditTaskButton({ task, onEdit }: EditTaskButtonProps) {
  return (
    <IconButton
      icon="edit"
      tone="blue"
      label={`Редактировать задачу: ${task.text}`}
      onClick={() => onEdit(task)}
    />
  );
}

export default EditTaskButton;
