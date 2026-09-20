import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BannerButtonProps {
  href: string;
  children: React.ReactNode;

  variant?: 'inline' | 'absolute';
  className?: string;
}

export function BannerButton({
  href,
  children,
  variant = 'inline',
  className,
}: BannerButtonProps) {
  return (
    <Button
      asChild
      size='lg'
      className={cn(
        'bg-brand hover:bg-brand-hover text-white font-bold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus focus-visible:ring-offset-2 focus-visible:ring-offset-black/50',

        'px-6 py-3 text-xs min-[511px]:px-12 min-[511px]:py-6 min-[511px]:text-base',

        variant === 'absolute' &&
          'w-full min-[511px]:w-auto mt-8 min-[511px]:mt-0 min-[511px]:absolute min-[511px]:bottom-8 z-20',

        className,
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}
