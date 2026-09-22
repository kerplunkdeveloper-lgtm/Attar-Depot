import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product } from '@/types';

interface ProductQueryParams {
  category?: string;
  fragranceFamily?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  priceRange?: string;
  sort?: string;
  page?: number;
  limit?: number;
  // Vera-style filter fields
  gender?: string;
  notes?: string;       // comma-separated e.g. "Musk,Floral"
  collection?: string;
  occasion?: string;    // comma-separated
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
      if (params.priceRange) query.append('priceRange', params.priceRange);
      if (params.sort) query.append('sort', params.sort);
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      // Vera-style filters
      if (params.gender) query.append('gender', params.gender);
      if (params.notes) query.append('notes', params.notes);
      if (params.collection) query.append('collection', params.collection);
      if (params.occasion) query.append('occasion', params.occasion);

      const { data } = await api.get(`/products?${query.toString()}`);
      return data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
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

export const useProductDetails = (idOrSlug: string, initialProduct?: Product) => {
  const queryClient = useQueryClient();

  return useQuery<{ product: Product; relatedProducts: Product[] }>({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${idOrSlug}`);
      return data;
    },
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => {
      if (previousData) return previousData;
      if (initialProduct) {
        return { product: initialProduct, relatedProducts: [] };
      }
      // Instant cache search from previously loaded product lists
      const allQueries = queryClient.getQueriesData<ProductsResponse>({ queryKey: ['products'] });
      for (const [_, qData] of allQueries) {
        const found = qData?.products?.find(
          (p: Product) => p.slug === idOrSlug || p._id === idOrSlug
        );
        if (found) return { product: found, relatedProducts: [] };
      }
      const featuredData = queryClient.getQueryData<{
        featured: Product[];
        bestSellers: Product[];
      }>(['featured-products']);
      if (featuredData) {
        const found = [...featuredData.featured, ...featuredData.bestSellers].find(
          (p) => p.slug === idOrSlug || p._id === idOrSlug
        );
        if (found) return { product: found, relatedProducts: [] };
      }
      return undefined;
    },
  });
};
