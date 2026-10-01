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

// Универсальный тип для любого товара в карусели
export interface CarouselProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice?: number | null;
  image: string;
  rating?: number; // Опциональный — подходит и для SpecialOffer, и для ProductCardData
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

export interface ProductWithCategory extends Product {
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface GetProductBySlugQuery {
  productBySlug: ProductWithCategory | null;
}

export interface SimilarProductsQuery {
  productsByCategory: ProductCardData[];
}

export interface CartItemType {
  id: string;
  quantity: number;
  totalPrice: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    inStock: boolean;
  };
}

export interface CartType {
  items: CartItemType[];
  totalAmount: number;
}
