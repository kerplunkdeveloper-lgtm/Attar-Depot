import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { TaxonomySummary, Collection, FragranceNote, Occasion, Category } from '@/types';

// Public query for storefront
export const usePublicTaxonomy = () => {
  return useQuery<{
    categories: Category[];
    collections: Collection[];
    notes: FragranceNote[];
    occasions: Occasion[];
  }>({
    queryKey: ['public-taxonomy'],
    queryFn: async () => {
      const { data } = await api.get('/taxonomy');
      return data;
    },
    staleTime: 3 * 60 * 1000,
  });
};

// Admin query with stats & inactive items
export const useAdminTaxonomy = () => {
  return useQuery<TaxonomySummary>({
    queryKey: ['admin-taxonomy'],
    queryFn: async () => {
      const { data } = await api.get('/taxonomy/all');
      return data;
    },
    staleTime: 30 * 1000,
  });
};

// ==========================================
// ─── COLLECTIONS MUTATIONS ────────────────
// ==========================================

export const useAdminCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (colData: Partial<Collection>) => {
      const { data } = await api.post('/taxonomy/collections', colData);
      return data.collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: colData }: { id: string; data: Partial<Collection> }) => {
      const { data } = await api.put(`/taxonomy/collections/${id}`, colData);
      return data.collection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/taxonomy/collections/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

// ==========================================
// ─── FRAGRANCE NOTES MUTATIONS ────────────
// ==========================================

export const useAdminCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteData: Partial<FragranceNote>) => {
      const { data } = await api.post('/taxonomy/notes', noteData);
      return data.note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: noteData }: { id: string; data: Partial<FragranceNote> }) => {
      const { data } = await api.put(`/taxonomy/notes/${id}`, noteData);
      return data.note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/taxonomy/notes/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

// ==========================================
// ─── OCCASIONS MUTATIONS ──────────────────
// ==========================================

export const useAdminCreateOccasion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (occData: Partial<Occasion>) => {
      const { data } = await api.post('/taxonomy/occasions', occData);
      return data.occasion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminUpdateOccasion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: occData }: { id: string; data: Partial<Occasion> }) => {
      const { data } = await api.put(`/taxonomy/occasions/${id}`, occData);
      return data.occasion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};

export const useAdminDeleteOccasion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/taxonomy/occasions/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['public-taxonomy'] });
      queryClient.invalidateQueries({ queryKey: ['product-filter-options'] });
    },
  });
};
