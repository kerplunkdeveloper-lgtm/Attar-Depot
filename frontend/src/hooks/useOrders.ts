import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Order } from '@/types';

export const useMyOrders = (enabled: boolean = true) => {
  return useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/my-orders');
      return data.orders || [];
    },
    enabled,
    staleTime: 3 * 60 * 1000,
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
    },
  });
};
