import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Coupon, AppliedCoupon } from '@/types';

// Fetch active coupons for store patrons
export const useCoupons = (params?: { limit?: number }) => {
  return useQuery<{
    success: boolean;
    count: number;
    coupons: Coupon[];
  }>({
    queryKey: ['public-coupons', params],
    queryFn: async () => {
      const { data } = await api.get('/coupons');
      return data;
    },
    staleTime: 60 * 1000,
  });
};

// Fetch banner coupons for Navbar top announcement and Auth modal/login/register banners
export const useBannerCoupons = () => {
  return useQuery<{
    success: boolean;
    count: number;
    coupons: Coupon[];
  }>({
    queryKey: ['banner-coupons'],
    queryFn: async () => {
      const { data } = await api.get('/coupons/banner');
      return data;
    },
    staleTime: 30 * 1000,
  });
};

// Mutation to validate coupon code against current subtotal
export const useValidateCoupon = () => {
  return useMutation<{
    success: boolean;
    valid: boolean;
    message: string;
    coupon: AppliedCoupon;
  }, any, { code: string; orderTotal: number }>({
    mutationFn: async ({ code, orderTotal }) => {
      const { data } = await api.post('/coupons/validate', { code, orderTotal });
      return data;
    },
  });
};

// ==========================================
// ADMIN DASHBOARD CRUD HOOKS
// ==========================================

export interface AdminCouponsParams {
  search?: string;
  status?: 'all' | 'active' | 'expired' | 'inactive';
  sort?: string;
}

export const useAdminCoupons = (params?: AdminCouponsParams) => {
  return useQuery<{
    success: boolean;
    count: number;
    coupons: Coupon[];
    stats: {
      totalCoupons: number;
      activeCoupons: number;
      totalUsages: number;
    };
  }>({
    queryKey: ['admin-coupons', params],
    queryFn: async () => {
      const query = new URLSearchParams();
      query.set('admin', 'true');
      if (params?.search) query.set('search', params.search);
      if (params?.status && params.status !== 'all') query.set('status', params.status);
      if (params?.sort) query.set('sort', params.sort);

      const { data } = await api.get(`/coupons?${query.toString()}`);
      return data;
    },
    staleTime: 10 * 1000,
  });
};

export const useAdminCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (couponData: Partial<Coupon>) => {
      const { data } = await api.post('/coupons', couponData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['banner-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['public-coupons'] });
    },
  });
};

export const useAdminUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Coupon> }) => {
      const res = await api.put(`/coupons/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['banner-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['public-coupons'] });
    },
  });
};

export const useAdminDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/coupons/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['banner-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['public-coupons'] });
    },
  });
};

export const useAdminToggleCouponStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/coupons/${id}/toggle-status`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['banner-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['public-coupons'] });
    },
  });
};

export const useAdminSeedDefaultCoupons = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/coupons/seed-defaults');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['banner-coupons'] });
      queryClient.invalidateQueries({ queryKey: ['public-coupons'] });
    },
  });
};
