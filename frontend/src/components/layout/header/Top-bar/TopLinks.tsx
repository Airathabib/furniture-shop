'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'О компании', href: '/about' },
  { label: 'Гарантия и возврат', href: '/warranty' },
  { label: 'Корпоративным клиентам', href: '/corporate' },
  { label: 'Дизайн-решение', href: '/design' },
] as const;

export function TopLinks() {
  const pathname = usePathname();

  return (
    <nav
      className='flex items-center gap-8'
      aria-label='Дополнительная навигация'
    >
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors focus-brand rounded-sm ${
              isActive
                ? 'text-brand font-medium'
                : 'text-muted-foreground hover:text-brand'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
