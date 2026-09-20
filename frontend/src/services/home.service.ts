import { GET_SPECIAL_OFFERS, GET_TOP_CATEGORIES, GET_TOP_RATED } from '@/constants/constants';
import { getServerApolloClient } from '@/lib/apollo-client.server';
import { HomePageData } from '@/types/types';

export async function getHomePageData() {
  const client = await getServerApolloClient();

  const [specialOffersRes, topRatedRes, categoriesRes] = await Promise.all([
    client.query<Pick<HomePageData, 'specialOffers'>>({
      query: GET_SPECIAL_OFFERS,
      variables: { limit: 150 },
    }),
    client.query<Pick<HomePageData, 'topRated'>>({
      query: GET_TOP_RATED,
      variables: { limit: 50 },
    }),
    client.query<Pick<HomePageData, 'topCategories'>>({
      query: GET_TOP_CATEGORIES,
      variables: { limit: 5 },
    }),
  ]);

  return {
    specialOffers: specialOffersRes.data?.specialOffers || [],
    topRated: topRatedRes.data?.topRated || [],
    topCategories: categoriesRes.data?.topCategories || [],
  };
}
