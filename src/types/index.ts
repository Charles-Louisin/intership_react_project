import { ReactNode } from 'react';

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string;
    thumbnail: string;
    rating: number;
    stock: number;
    [key: string]: any;
}

export interface ProductReview {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    image?: string;
    isVerified?: boolean;
}

export interface Post {
    id: number;
    title: string;
    body: string;
    user?: User;
    tags?: string[];
    reactions: {
        likes: number;
        dislikes: number;
    };
    createdAt: string;
}

export interface Comment {
  id: number;
  postId: number;
  body: string;
  user: User;
  createdAt: string;
}

export interface SidebarContextProps {
  state: boolean;
  setState: (value: boolean) => void;
}

export interface CommonProps {
  children?: ReactNode;
  className?: string;
}
