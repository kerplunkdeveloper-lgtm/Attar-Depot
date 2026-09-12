import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Review } from '@/types';

export const useProductReviews = (productId: string) => {
  return useQuery<Review[]>({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/product/${productId}`);
      return data.reviews || [];
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTestimonials = () => {
  return useQuery<Review[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data } = await api.get('/reviews/testimonials');
      return data.testimonials || [];
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useAddReview = (productId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewData: {
      rating: number;
      title?: string;
      comment: string;
      longevityRating?: number;
      projectionRating?: number;
    }) => {
      const { data } = await api.post(`/reviews/product/${productId}`, reviewData);
      return data;
    },
    onSuccess: () => {
      // Invalidate review queries and product details so average rating updates immediately
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
