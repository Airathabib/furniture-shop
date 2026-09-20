import { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps extends ComponentPropsWithoutRef<'div'> {
  icon?: React.ReactNode;

  title: string;

  description?: string;

  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-4 text-center',
        className,
      )}
      {...props}
    >
      {/* Иконка */}
      {icon && <div className='flex items-center justify-center'>{icon}</div>}

      {/* Текст */}
      <div className='space-y-1'>
        <h3 className='text-lg font-semibold text-foreground'>{title}</h3>
        {description && (
          <p className='text-sm text-muted-foreground max-w-sm'>
            {description}
          </p>
        )}
      </div>

      {/* Дополнительное действие */}
      {action && <div className='mt-2'>{action}</div>}
    </div>
  );
}
