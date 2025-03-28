import axios from 'axios';
import { LoginCredentials, User } from '../types/user';

interface ProductsResponse {
    products: Array<any>;
    total: number;
    skip: number;
    limit: number;
}

const api = axios.create({
    baseURL: 'https://dummyjson.com',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const queryKeys = {
    users: {
        all: ['users'] as const,
        detail: (id: number) => ['users', id] as const,
    },
    auth: {
        login: ['auth', 'login'] as const,
    },
    products: {
        all: ['products'] as const,
    }
} as const;

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<User> => {
        const response = await api.post<User>('/auth/login', credentials);
        return response.data;
    }
};

export const userApi = {
    getAll: async (): Promise<User[]> => {
        const response = await api.get<{ users: User[] }>('/users');
        return response.data.users;
    },

    getById: async (id: number): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    }
};

export const productApi = {
    getAll: async (skip: number = 0, limit: number = 30) => {
        const response = await api.get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
        return response.data;
    }
};
