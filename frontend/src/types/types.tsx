// ==========================================
// 1. КАТЕГОРИИ
// ==========================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string | null;
  productCount?: number;
  subcategories?: {
    id: string;
    name: string;
    categoryId: string;
  }[];
}

// Для главной страницы используем тот же тип Category
export type TopCategory = Category;

export interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories?: {
    id: string;
    name: string;
    categoryId: string;
  }[];
  className?: string;
}

export interface TopCategoriesSectionProps {
  categories: TopCategory[];
}

// ==========================================
// 2. ТОВАРЫ И СПЕЦПРЕДЛОЖЕНИЯ
// ==========================================
export interface SpecialOffer {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  image: string;
}

export interface SpecialOffersSectionProps {
  products: SpecialOffer[];
}

export interface SpecialOffersQueryData {
  specialOffers: SpecialOffer[];
}

export interface TopRatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  rating: number;
}

export interface TopRatedSectionProps {
  products: TopRatedProduct[];
}

// ==========================================
// 3. ДАННЫЕ ГЛАВНОЙ СТРАНИЦЫ (ЕДИНСТВЕННЫЙ ВАРИАНТ)
// ==========================================
export interface HomePageData {
  specialOffers: SpecialOffer[];
  topRated: TopRatedProduct[];
  topCategories: TopCategory[];
}

// ==========================================
// 4. БАННЕРЫ
// ==========================================
export interface StaticBannerProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkHref?: string;
  buttonText?: string;
  titleColor?: string;
  align?: "left" | "center" | "right";
  overlayOpacity?: number;
  className?: string;
  usePlayfair?: boolean;
}

export interface PromoBannerProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  imageUrl_1024?: string;
  imageUrl_768?: string;
  imageUrl_511?: string;
  linkHref?: string;
  buttonText?: string;
  className?: string;
  isPriority?: boolean;
  id?: string | number;
  titleColor?: string;
  usePlayfairForTitle?: boolean;
  subtitleColor?: string;
}

// ==========================================
// 5. АВТОРИЗАЦИЯ И ПОЛЬЗОВАТЕЛЬ
// ==========================================
export interface GetMeQueryData {
  getMe: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface LoginMutationData {
  login: {
    userId: string;
    email: string;
    name?: string | null;
  };
}

export interface RegisterMutationData {
  register: {
    userId: string;
    email: string;
    name?: string | null;
  };
}

export type AuthMode = "login" | "register";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export interface ApolloErrorLike {
  graphQLErrors?: { message: string; extensions?: { code?: string } }[];
  message?: string;
}

// ==========================================
// 6. ЗАПРОСЫ КАТАЛОГА И ТОВАРОВ
// ==========================================
export interface CategoryBySlugQueryData {
  categoryBySlug: {
    id: string;
    name: string;
    slug: string;
    image: string;
    productCount: number;
    subcategories: {
      id: string;
      name: string;
      categoryId: string;
    }[];
  } | null;
}

export interface ProductsByCategoryQueryData {
  productsByCategory: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice?: number | null;
    image: string;
    rating: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sku?: string | null;
  fullDescription?: string | null;
  collection?: string | null;
  size?: string | null;
  configuration?: string | null;
  color?: string | null;
  material?: string | null;
  warranty?: string | null;
  price: number;
  oldPrice?: number | null;
  image: string;
  images: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  rating: number;
}

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  image: string;

  rating?: number;

  showOldPrice?: boolean;
  className?: string;
}

export interface ProductFullData extends ProductCardData {
  description?: string | null;
  fullDescription?: string | null;
  images: string[];
  material?: string | null;
  color?: string | null;
  warranty?: string | null;
  inStock: boolean;
  reviewCount: number;
  category?: {
    name: string;
  } | null;
}

export interface GetProductBySlugQuery {
  productBySlug: ProductFullData | null;
}


