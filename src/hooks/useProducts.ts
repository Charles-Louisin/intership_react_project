import { useQuery } from '@tanstack/react-query';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('https://dummyjson.com/products?limit=100');
      const data = await response.json();
      return data;
    },
  });
};
