import { AlertCircle } from 'lucide-react';

type Props = {
  message?: string;
  variant?: 'default' | 'compact';
};

export function ErrorMessage({ message, variant = 'default' }: Props) {
  if (!message) return null;

  if (variant === 'compact') {
    return (
      <p className='text-sm text-destructive' role='alert'>
        {message}
      </p>
    );
  }

  return (
    <div
      className='flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md'
      role='alert'
    >
      <AlertCircle className='h-4 w-4 text-destructive mt-0.5 flex-shrink-0' />
      <p className='text-sm text-destructive'>{message}</p>
    </div>
  );
}
