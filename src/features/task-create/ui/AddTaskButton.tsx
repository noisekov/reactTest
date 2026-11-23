import Icon from '@/shared/ui/Icon/Icon';
import Button from '@/shared/ui/Button/Button';

interface AddTaskButtonProps {
  disabled: boolean;
  onClick: () => void;
}

function AddTaskButton({ disabled, onClick }: AddTaskButtonProps) {
  return (
    <Button variant="add" type="button" onClick={onClick} disabled={disabled}>
      <Icon name="plus" />
      Добавить
    </Button>
  );
}

export default AddTaskButton;
