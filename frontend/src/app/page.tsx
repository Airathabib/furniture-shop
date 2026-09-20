import { TopCategoriesSection } from '@/components/category/top-categories-section';
import { PromoBannersSection } from '@/components/promo/promo-banners-section';
import { SpecialOffersSection } from '@/components/promo/special-offers-section';
import { StaticBanner } from '@/components/promo/static-banner';
import { TopRatedSection } from '@/components/promo/top-rated-section';
import { promoBanners } from '@/data/promo-banners';
import { getHomePageData } from '@/services/home.service';

export default async function HomePage() {
  const { specialOffers, topRated, topCategories } = await getHomePageData();

  return (
    <div className='flex flex-col w-full'>
      <PromoBannersSection banners={promoBanners} />

      <div className='w-full mt-[70px]'>
        <SpecialOffersSection products={specialOffers} />
      </div>
      <TopRatedSection products={topRated} />
      <div className='w-full  mb-10'>
        <StaticBanner
          title='Оксфорд 1950'
          subtitle={'Новая коллекция \n изысканных кресел'}
          imageUrl='/images/static_banner/static_banner.jpg'
          linkHref='/catalog?category=chairs'
          buttonText='Ознакомиться'
          align='left'
          overlayOpacity={30}
          usePlayfair={true}
          titleColor='text-[#D4B986]'
        />
      </div>
      <TopCategoriesSection categories={topCategories} />
    </div>
  );
}
