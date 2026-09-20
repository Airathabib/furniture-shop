import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { TypographyH3 } from '../ui/typography-h3';
import { useMediaQuery } from '@/hooks/use-media-query';
import { BannerButton } from '../ui/banner-button';
import { PromoBannerProps } from '@/types/types';



export function PromoBanner({
  id,
  title,
  subtitle, // ✅ Деструктуризируем
  imageUrl,
  imageUrl_1024,
  imageUrl_768,
  imageUrl_511,
  linkHref,
  buttonText = 'Подробнее',
  className,
  isPriority = false,
  titleColor = 'text-white',
  usePlayfairForTitle = false, 
  subtitleColor = 'text-white/80', 
}: PromoBannerProps) {
  const isMobile = useMediaQuery(510);
  const isTablet = useMediaQuery('(min-width: 511px) and (max-width: 767px)');
  const isSmallDesktop = useMediaQuery(
    '(min-width: 768px) and (max-width: 1023px)',
  );

  const currentImageUrl = isMobile
    ? imageUrl_511 || imageUrl
    : isTablet
      ? imageUrl_768 || imageUrl
      : isSmallDesktop
        ? imageUrl_1024 || imageUrl
        : imageUrl;

  return (
    <div className={cn('relative w-full group', className)}>
      <div className='relative w-full h-[300px] min-[511px]:h-[400px] min-[511px]:overflow-hidden'>
        <Image
          src={currentImageUrl}
          alt={title}
          fill
          className='object-cover transition-transform duration-700 ease-out group-hover:scale-105'
          priority={isPriority}
          sizes='100vw'
        />

        <div className='relative z-10 w-full h-full flex items-center'>
          <Container>
  
            <div className='max-w-2xl space-y-4 min-[511px]:space-y-6'>

              <TypographyH3
                className={cn(
                  titleColor,
                  usePlayfairForTitle &&
                    'font-[family-name:var(--font-playfair)]',
                  'text-[20px] min-[511px]:text-3xl lg:text-5xl font-bold drop-shadow-md leading-[1.2] text-left',
                )}
              >
                {title}
              </TypographyH3>

              {subtitle && (
                <p
                  className={cn(
                    subtitleColor,
                    'text-sm min-[511px]:text-lg font-normal drop-shadow-md leading-relaxed text-left',
                  )}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </Container>
        </div>
      </div>

      {linkHref && (
        <Container>
          <BannerButton href={linkHref} variant='absolute'>
            {buttonText}
          </BannerButton>
        </Container>
      )}
    </div>
  );
}
