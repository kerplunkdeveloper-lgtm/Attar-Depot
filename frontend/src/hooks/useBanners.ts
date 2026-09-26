import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Banner {
  _id: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const useBanners = () => {
  return useQuery<{ success: boolean; banners: Banner[] }>({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data } = await api.get('/banners');
      return data;
    },
  });
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bannerData: Partial<Banner>) => {
      const { data } = await api.post('/banners', bannerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, bannerData }: { id: string; bannerData: Partial<Banner> }) => {
      const { data } = await api.put(`/banners/${id}`, bannerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/banners/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
};
