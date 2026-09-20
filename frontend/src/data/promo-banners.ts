import { PromoBannerProps } from '@/components/promo/promo-banner';

export const promoBanners: PromoBannerProps[] = [
  {
    id: '1',
    title: 'Скидка 15% на первую покупку',
    imageUrl: '/images/banners/banner-1.jpg',
    imageUrl_1024: '/images/banners/banner-1_1024.jpg',
    imageUrl_768: '/images/banners/banner-1_768.jpg',
    imageUrl_511: '/images/banners/banner-1_511.jpg',
    linkHref: '/catalog?discount=first',
    buttonText: 'Получить',
    titleColor: 'text-banner-title',
  },
  {
    id: '2',
    title: '1000+ аксессуаров для дома',
    imageUrl: '/images/banners/banner-2.jpg',
    imageUrl_1024: '/images/banners/banner-2_1024.jpg',
    imageUrl_768: '/images/banners/banner-2_768.jpg',
    imageUrl_511: '/images/banners/banner-2_511.jpg',
    linkHref: '/catalog?category=accessories',
    buttonText: 'Подробнее',
    titleColor: 'text-banner-title',
  },
  {
    id: '3',
    title: 'Новая коллекция 2026',
    imageUrl: '/images/banners/banner-3.jpg',
    imageUrl_1024: '/images/banners/banner-3_1024.jpg',
    imageUrl_768: '/images/banners/banner-3_768.jpg',
    imageUrl_511: '/images/banners/banner-3_511.jpg',
    linkHref: '/catalog?new=true',
    buttonText: 'Подробнее',
    titleColor: 'text-white',
  },

  // Если нужно будет добавить еще баннер,то просто добавь объект сюда
];
