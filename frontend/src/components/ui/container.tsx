import { cn } from '@/lib/utils';
import { ComponentPropsWithoutRef } from 'react';

interface ContainerProps extends ComponentPropsWithoutRef<'div'> {
  maxWidth?: string;
}

export function Container({
  maxWidth,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        //   АДАПТИВНЫЕ ОТСТУПЫ :
        // - px-3 (12px) на мобильных (<= 510px)
        // - px-[24px] (24px) на средних (511px - 767px)
        // - md:px-9 (36px) на планшетах (768px - 1023px)
        // - lg:container lg:mx-auto lg:px-4 на десктопах (>= 1024px)
        'w-full px-3 min-[511px]:px-[24px] md:px-9 lg:container lg:mx-auto lg:px-4',

        // Кастомная максимальная ширина (если передана)
        maxWidth,

        // Дополнительные классы из пропсов
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
