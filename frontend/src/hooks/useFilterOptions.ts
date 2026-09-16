import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface PriceRange {
  label: string;
  value: string;
  min: number;
  max: number;
}

export interface FilterOptions {
  notes: string[];
  genders: string[];
  collections: string[];
  occasions: string[];
  priceRanges: PriceRange[];
  priceStats: { minPrice: number; maxPrice: number };
}

export const useFilterOptions = () => {
  return useQuery<FilterOptions>({
    queryKey: ['product-filter-options'],
    queryFn: async () => {
      const { data } = await api.get('/products/filter-options');
      return data.filterOptions;
    },
    staleTime: 5 * 60 * 1000, // cache for 5 min
    placeholderData: {
      notes: [],
      genders: ['Men', 'Women', 'Unisex'],
      collections: [],
      occasions: [],
      priceRanges: [
        { label: 'Under ₹1999', value: 'under-1999', min: 0, max: 1999 },
        { label: '₹2000 – ₹2999', value: '2000-2999', min: 2000, max: 2999 },
        { label: '₹3000 – ₹3999', value: '3000-3999', min: 3000, max: 3999 },
        { label: '₹4000 – ₹4999', value: '4000-4999', min: 4000, max: 4999 },
        { label: '₹5000 – ₹5999', value: '5000-5999', min: 5000, max: 5999 },
      ],
      priceStats: { minPrice: 0, maxPrice: 12000 },
    },
  });
};
