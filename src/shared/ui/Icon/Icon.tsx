import type { CSSProperties } from 'react';
import searchIcon from '@/assets/icons/search.svg';
import trashIcon from '@/assets/icons/trash.svg';
import closeIcon from '@/assets/icons/close.svg';
import checkIcon from '@/assets/icons/check.svg';
import editIcon from '@/assets/icons/edit.svg';
import plusIcon from '@/assets/icons/plus.svg';
import todoIcon from '@/assets/icons/todo.svg';
import progressIcon from '@/assets/icons/progress.svg';
import reviewIcon from '@/assets/icons/review.svg';
import doneIcon from '@/assets/icons/done.svg';
import styles from './Icon.module.scss';

export type IconName =
  | 'search'
  | 'trash'
  | 'close'
  | 'check'
  | 'edit'
  | 'plus'
  | 'todo'
  | 'progress'
  | 'review'
  | 'done';

const iconSources: Record<IconName, string> = {
  search: searchIcon,
  trash: trashIcon,
  close: closeIcon,
  check: checkIcon,
  edit: editIcon,
  plus: plusIcon,
  todo: todoIcon,
  progress: progressIcon,
  review: reviewIcon,
  done: doneIcon
};

interface IconProps {
  name: IconName;
  className?: string;
}

function Icon({ name, className = '' }: IconProps) {
  const iconStyle: CSSProperties = {
    maskImage: `url("${iconSources[name]}")`,
    WebkitMaskImage: `url("${iconSources[name]}")`
  };

  return (
    <span
      className={[styles.icon, className].filter(Boolean).join(' ')}
      style={iconStyle}
      aria-hidden="true"
    />
  );
}

export default Icon;
