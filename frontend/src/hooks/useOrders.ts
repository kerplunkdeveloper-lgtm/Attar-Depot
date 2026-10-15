import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAppSelector } from '@/store';
import { Order } from '@/types';
import { broadcastDataChange } from '@/lib/dataSync';

export const useMyOrders = (enabled: boolean = true) => {
  const { user } = useAppSelector((state) => state.auth);

  return useQuery<Order[]>({
    queryKey: ['my-orders', user?._id],
    queryFn: async () => {
      const { data } = await api.get('/orders/my-orders');
      return data.orders || [];
    },
    enabled: enabled && !!user,
    staleTime: 10 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useOrderDetails = (orderId: string) => {
  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${orderId}`);
      return data.order;
    },
    enabled: !!orderId,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: true,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderPayload: any) => {
      const { data } = await api.post('/orders', orderPayload);
      return data.order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['featured-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      broadcastDataChange(['my-orders', 'orders', 'products', 'featured-products', 'admin-stats', 'admin-orders']);
    },
  });
};
