import { gql } from '@apollo/client';

// === Типы для мутаций ===

export interface LoginMutationData {
  login: {
    userId: string;
    email: string;
    name?: string | null;
    role: string;
  };
}

export interface LoginMutationVariables {
  input: {
    email: string;
    password: string;
  };
}

export interface RegisterMutationData {
  register: {
    userId: string;
    email: string;
    name?: string | null;
    role: string;
  };
}

export interface RegisterMutationVariables {
  input: {
    name?: string | null;
    email: string;
    password: string;
  };
}

export interface LogoutMutationData {
  logout: {
    success: boolean;
  };
}

export interface GraphQLErrorLike {
  graphQLErrors?: Array<{ message: string }>;
}

// === Мутации ===

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginDto!) {
    login(input: $input) {
      userId
      email
      name
      role
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterDto!) {
    register(input: $input) {
      userId
      email
      name
      role
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
    }
  }
`;
