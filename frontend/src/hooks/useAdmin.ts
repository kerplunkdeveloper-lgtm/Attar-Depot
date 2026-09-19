import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order, Product, Category, Review, User, Customer } from '@/types';

export const useAdminStats = () => {
  return useQuery<{
    stats: {
      totalRevenue: number;
      totalOrders: number;
      totalProducts: number;
      totalCategories: number;
      totalUsers: number;
      pendingOrdersCount: number;
      deliveredOrdersCount: number;
    };
    recentOrders: Order[];
  }>({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/stats');
      return data;
    },
    staleTime: 60 * 1000,
  });
};

export const useAdminOrders = (status?: string, enabled = true) => {
  return useQuery<{ orders: Order[]; total: number }>({
    queryKey: ['admin-orders', status],
    queryFn: async () => {
      const url = status && status !== 'All' ? `/orders?status=${status}` : '/orders';
      const { data } = await api.get(url);
      return data;
    },
    enabled,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      trackingNumber,
    }: {
      id: string;
      status: string;
      trackingNumber?: string;
    }) => {
      const { data } = await api.put(`/orders/${id}/status`, { status, trackingNumber });
      return data.order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useAdminCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData | any) => {
      const { data } = await api.post('/products', formData);
      return data.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useAdminDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useAdminCategories = (params?: {
  search?: string;
  status?: string;
  sort?: string;
}) => {
  return useQuery<{
    success: boolean;
    count: number;
    categories: (Category & { productCount?: number })[];
  }>({
    queryKey: ['admin-categories', params],
    queryFn: async () => {
      const query = new URLSearchParams();
      query.set('all', 'true');
      if (params?.search) query.set('search', params.search);
      if (params?.status && params.status !== 'all') query.set('status', params.status);
      if (params?.sort) query.set('sort', params.sort);
      const { data } = await api.get(`/categories?${query.toString()}`);
      return data;
    },
    staleTime: 10 * 1000,
  });
};

export const useAdminCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (catData: {
      name: string;
      slug?: string;
      description?: string;
      image?: string;
      featured?: boolean;
      isActive?: boolean;
    }) => {
      const { data } = await api.post('/categories', catData);
      return data.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/products/${id}`, data);
      return response.data.product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        slug?: string;
        description?: string;
        image?: string;
        featured?: boolean;
        isActive?: boolean;
      };
    }) => {
      const response = await api.put(`/categories/${id}`, data);
      return response.data.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminToggleCategoryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/categories/${id}/toggle-status`);
      return data.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
    },
  });
};

export const useAdminToggleCategoryFeatured = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/categories/${id}/toggle-featured`);
      return data.category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
    },
  });
};

export const useAdminDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (arg: { id: string; force?: boolean } | string) => {
      const id = typeof arg === 'string' ? arg : arg.id;
      const isForce = typeof arg === 'object' && arg.force;
      const url = isForce ? `/categories/${id}?force=true` : `/categories/${id}`;
      const { data } = await api.delete(url);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminBulkDeleteCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ ids, force }: { ids: string[]; force?: boolean }) => {
      const { data } = await api.post('/categories/bulk-delete', { ids, force });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminSeedDefaultCategories = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/categories/seed-defaults');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
    },
  });
};

export const useAdminCustomers = () => {
  return useQuery<{
    success: boolean;
    count: number;
    summary?: {
      total: number;
      active: number;
      new: number;
      blocked: number;
    };
    customers: Customer[];
  }>({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { data } = await api.get('/admin/customers');
      return data;
    },
    staleTime: 30 * 1000,
  });
};

export const useAdminCustomerDetails = (customerId?: string | null) => {
  return useQuery<{
    success: boolean;
    customer: Customer;
    orders: Order[];
  }>({
    queryKey: ['admin-customer-details', customerId],
    queryFn: async () => {
      if (!customerId) throw new Error('Customer ID required');
      const { data } = await api.get(`/admin/customers/${customerId}`);
      return data;
    },
    enabled: !!customerId,
  });
};

export const useAdminCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (customerData: any) => {
      const { data } = await api.post('/admin/customers', customerData);
      return data.customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useAdminUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'Active' | 'Inactive' | 'Blocked' }) => {
      const { data } = await api.put(`/admin/customers/${id}/status`, { status });
      return data.customer;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-customer-details', variables.id] });
    },
  });
};

export const useAdminUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/admin/customers/${id}`, data);
      return response.data.customer;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-customer-details', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};

export const useAdminDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/admin/customers/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
};
