import { TypographyH3 } from '@/components/ui/typography-h3';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-8'>
      <div className='text-center space-y-6'>
        <h1 className='text-6xl font-extrabold text-brand tracking-tight'>
          404
        </h1>

        <TypographyH3 className='text-foreground'>
          Похоже, вы перешли по неверной ссылке или страница была удалена.
        </TypographyH3>

        <Link
          href='/'
          className='inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background'
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
