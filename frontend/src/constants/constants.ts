import { gql } from "@apollo/client";

export const GET_SPECIAL_OFFERS = gql`
  query GetSpecialOffers($limit: Int) {
    specialOffers(limit: $limit) {
      id
      name
      slug
      price
      oldPrice
      image
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    getMe {
      id
      name
      email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginDto!) {
    login(input: $input) {
      userId
      email
      name
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterDto!) {
    register(input: $input) {
      userId
      email
      name
    }
  }
`;

export const GET_TOP_RATED = gql`
  query GetTopRated($limit: Int) {
    topRated(limit: $limit) {
      id
      name
      slug
      price
      oldPrice
      image
      rating
    }
  }
`;

export const GET_TOP_CATEGORIES = gql`
  query GetTopCategories($limit: Int) {
    topCategories(limit: $limit) {
      id
      name
      slug
      image
      subcategories {
        id
        name
        categoryId
      }
    }
  }
`;

export const REFRESH_MUTATION = gql`
  mutation Refresh {
    refresh {
      userId
      email
      name
      role
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      slug
      sku
      description
      fullDescription
      collection
      size
      configuration
      color
      material
      warranty
      price
      oldPrice
      image
      images
      inStock
      rating
      reviewCount
      category {
        id
        name
        slug
      }
    }
  }
`;

export const GET_SIMILAR_PRODUCTS = gql`
  query GetSimilarProducts($slug: String!, $limit: Int) {
    productsByCategory(slug: $slug, limit: $limit) {
      id
      name
      slug
      price
      oldPrice
      image
      rating
    }
  }
`;

export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: String!) {
    categoryBySlug(slug: $slug) {
      id
      name
      slug
      image
      subcategories {
        id
        name
        categoryId
      }
      productCount
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($slug: String!, $limit: Int) {
    productsByCategory(slug: $slug, limit: $limit) {
      id
      name
      slug
      price
      oldPrice
      image
      rating
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories {
      id
      name
      slug
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts(
    $limit: Int
    $categorySlugs: [String!]
    $minPrice: Float
    $maxPrice: Float
    $discountFilters: [String!]
    $colorFilters: [String!]
    $search: String
  ) {
    products(
      limit: $limit
      categorySlugs: $categorySlugs
      minPrice: $minPrice
      maxPrice: $maxPrice
      discountFilters: $discountFilters
      colorFilters: $colorFilters
			 search: $search
    ) {
      id
      name
      slug
      price
      oldPrice
      image
      rating
    }
  }
`;

export const CREATE_QUICK_ORDER = gql`
  mutation CreateQuickOrder($input: QuickOrderDto!) {
    quickOrder(input: $input) {
      id
      orderNumber
      status
      total
    }
  }
`;

export const GET_CART = gql`
  query GetCart {
    getCart {
      totalAmount
      items {
        id
        quantity
        totalPrice
        product {
          id
          name
          slug
          price
          image
          inStock
        }
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartDto!) {
    addToCart(input: $input) {
      totalAmount
      items {
        id
        quantity
        totalPrice
        product {
          id
          name
          slug
          price
          image
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($input: UpdateCartItemDto!) {
    updateCartItem(input: $input) {
      totalAmount
      items {
        id
        quantity
        totalPrice
        product {
          id
          name
          slug
          price
          image
        }
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: String!) {
    removeFromCart(productId: $productId) {
      totalAmount
      items {
        id
        quantity
        totalPrice
        product {
          id
          name
          slug
          price
          image
        }
      }
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      totalAmount
      items {
        id
        quantity
        totalPrice
        product {
          id
          name
          slug
          price
          image
        }
      }
    }
  }
`;

export const CHECKOUT = gql`
  mutation Checkout($input: CheckoutDto!) {
    checkout(input: $input) {
      id
      orderNumber
      total
      status
    }
  }
`;
