import { useQuery, useMutation } from '@tanstack/react-query';
import { userApi, queryKeys, authApi } from '../api/api';
import { LoginCredentials } from '../types/user';

export const useUsers = () => {
    return useQuery({
        queryKey: queryKeys.users.all,
        queryFn: userApi.getAll
    });
};

export const useUserById = (id: number) => {
    return useQuery({
        queryKey: queryKeys.users.detail(id),
        queryFn: () => userApi.getById(id)
    });
};

export const useLogin = () => {
    return useMutation({
        mutationFn: (credentials: LoginCredentials) => authApi.login(credentials)
    });
};
