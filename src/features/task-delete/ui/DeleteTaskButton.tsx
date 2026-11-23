import IconButton from '@/shared/ui/IconButton/IconButton';

interface DeleteTaskButtonProps {
  taskId: number;
  onDelete: (taskId: number) => void;
}

function DeleteTaskButton({ taskId, onDelete }: DeleteTaskButtonProps) {
  return (
    <IconButton
      icon="trash"
      tone="danger"
      label="Удалить задачу"
      onClick={(event) => {
        event.stopPropagation();
        onDelete(taskId);
      }}
    />
  );
}

export default DeleteTaskButton;
