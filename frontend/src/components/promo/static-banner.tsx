import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { TypographyH3 } from '../ui/typography-h3';
import { BannerButton } from '../ui/banner-button';
import { StaticBannerProps } from '@/types/types';



export function StaticBanner({
  title,
  subtitle,
  imageUrl,
  linkHref,
  buttonText = 'Подробнее',
  titleColor = 'text-white',
  align = 'left',
  overlayOpacity = 30,
  className,
  usePlayfair = false,
}: StaticBannerProps) {
  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      {/* 2. Блок с картинкой и текстом (имеет фиксированную высоту) */}
      <div className='relative w-full h-[210px] min-[511px]:h-[600px]'>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className='object-cover'
          priority
          sizes='100vw'
        />

        {/* Затемнение */}
        <div
          className='absolute inset-0 bg-black'
          style={{ opacity: overlayOpacity / 100 }}
        />

        {/* Текст поверх картинки */}
        <div className='relative z-10 w-full h-full flex items-center'>
          <Container>
            <div
              className={cn(
                'max-w-2xl space-y-4 min-[511px]:space-y-6',
                align === 'center' && 'text-center mx-auto',
                align === 'right' && 'text-right ml-auto',
                align === 'left' && 'text-left',
              )}
            >
              <TypographyH3
                size='custom'
                className={cn(
                  titleColor,
                  'text-[24px] min-[511px]:text-[60px] text-left',
                  'font-bold drop-shadow-md leading-[1.2]',
                )}
                style={
                  usePlayfair
                    ? { fontFamily: 'var(--font-playfair)' }
                    : undefined
                }
              >
                {title}
              </TypographyH3>

              {subtitle && (
                <p className='text-base min-[511px]:text-5xl text-white/90 drop-shadow-md leading-[1.2] whitespace-pre-line'>
                  {subtitle}
                </p>
              )}
            </div>
          </Container>
        </div>
      </div>

      {/* ✅ 3. Кнопка вынесена НА УРОВЕНЬ блока с картинкой (после него), но внутри общего relative div */}
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
