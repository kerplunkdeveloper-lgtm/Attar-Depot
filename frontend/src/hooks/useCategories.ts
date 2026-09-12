import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category } from '@/types';

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.categories || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
};
