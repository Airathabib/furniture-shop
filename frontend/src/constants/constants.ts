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
      price
      oldPrice
      image
      images
      description
      fullDescription
      warranty
      material
      color
      category {
        name
      }
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
