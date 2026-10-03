import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Banner } from '@/types';

// ==========================================
// PUBLIC HOMEPAGE HOOKS
// ==========================================

export const useBanners = () => {
  return useQuery<{
    success: boolean;
    count: number;
    banners: Banner[];
  }>({
    queryKey: ['public-banners'],
    queryFn: async () => {
      const { data } = await api.get('/banners');
      return data;
    },
    staleTime: 60 * 1000, // 1 minute
  });
};

export const useTrackBannerClick = () => {
  return useMutation({
    mutationFn: async (bannerId: string) => {
      if (!bannerId || bannerId.startsWith('default-')) return;
      const { data } = await api.post(`/banners/${bannerId}/click`);
      return data;
    },
  });
};

// ==========================================
// ADMIN DASHBOARD CRUD HOOKS
// ==========================================

export interface AdminBannersParams {
  search?: string;
  status?: 'all' | 'active' | 'inactive';
  sort?: 'order' | 'clicks-high' | 'newest' | 'oldest' | 'title-asc';
}

export const useAdminBanners = (params?: AdminBannersParams) => {
  return useQuery<{
    success: boolean;
    count: number;
    banners: Banner[];
    stats: {
      totalBanners: number;
      activeBanners: number;
      inactiveBanners: number;
      totalClicks: number;
    };
  }>({
    queryKey: ['admin-banners', params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.status && params.status !== 'all') query.set('status', params.status);
      if (params?.sort) query.set('sort', params.sort);

      const { data } = await api.get(`/banners/admin?${query.toString()}`);
      return data;
    },
    staleTime: 10 * 1000,
  });
};

export const useAdminCreateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bannerData: Partial<Banner>) => {
      const { data } = await api.post('/banners', bannerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['public-banners'] });
    },
  });
};

export const useAdminUpdateBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: updateData }: { id: string; data: Partial<Banner> }) => {
      const { data } = await api.put(`/banners/${id}`, updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['public-banners'] });
    },
  });
};

export const useAdminDeleteBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/banners/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['public-banners'] });
    },
  });
};

export const useAdminToggleBanner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/banners/${id}/toggle`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      queryClient.invalidateQueries({ queryKey: ['public-banners'] });
    },
  });
};
