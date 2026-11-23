import type { ButtonHTMLAttributes } from 'react';
import Icon, { type IconName } from '@/shared/ui/Icon/Icon';
import styles from './IconButton.module.scss';

export type IconButtonTone = 'neutral' | 'blue' | 'danger';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  tone?: IconButtonTone;
  label: string;
}

function IconButton({
  icon,
  tone = 'neutral',
  label,
  className = '',
  type = 'button',
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      {...buttonProps}
      className={[styles.button, styles[tone], className].filter(Boolean).join(' ')}
      type={type}
      aria-label={label}
      title={label}
    >
      <Icon name={icon} />
    </button>
  );
}

export default IconButton;
