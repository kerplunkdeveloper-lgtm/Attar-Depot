import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product } from '@/types';

interface ProductQueryParams {
  category?: string;
  fragranceFamily?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  totalPages: number;
  currentPage: number;
  products: Product[];
}

export const useProducts = (params: ProductQueryParams = {}) => {
  return useQuery<ProductsResponse>({
    queryKey: ['products', params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.fragranceFamily) query.append('fragranceFamily', params.fragranceFamily);
      if (params.search) query.append('search', params.search);
      if (params.minPrice) query.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) query.append('maxPrice', params.maxPrice.toString());
      if (params.sort) query.append('sort', params.sort);
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());

      const { data } = await api.get(`/products?${query.toString()}`);
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useFeaturedProducts = () => {
  return useQuery<{ featured: Product[]; bestSellers: Product[] }>({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data } = await api.get('/products/featured');
      return {
        featured: data.featured || [],
        bestSellers: data.bestSellers || [],
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductDetails = (idOrSlug: string) => {
  return useQuery<{ product: Product; relatedProducts: Product[] }>({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${idOrSlug}`);
      return data;
    },
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });
};
