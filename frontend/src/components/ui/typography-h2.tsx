import { cn } from '@/lib/utils';

type H2Props = React.ComponentProps<'h2'> & {
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'custom';
};

const sizeVariants = {
  small: 'text-base sm:text-lg',
  medium: 'text-xl sm:text-2xl',
  large: 'text-2xl sm:text-3xl lg:text-4xl',
  xlarge: 'text-3xl sm:text-4xl lg:text-5xl xl:text-6xl',
  custom: '',
};

export function TypographyH2({
  className,
  children,
  size = 'medium',
  ...props
}: H2Props) {
  return (
    <h2
      className={cn(
        'scroll-m-20 text-center font-semibold tracking-tight text-balance',
        sizeVariants[size],
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
