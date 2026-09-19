import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateUser } from '@/store/authSlice';
import { User, UserAddress } from '@/types';

export const useProfile = (enabled: boolean = true) => {
  const { user } = useAppSelector((state) => state.auth);

  return useQuery<User>({
    queryKey: ['user-profile', user?._id],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data.user;
    },
    enabled: enabled && !!user,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (profileData: {
      name?: string;
      title?: string;
      email?: string;
      phone?: string;
      avatar?: string;
    }) => {
      const { data } = await api.put('/auth/profile', profileData);
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        dispatch(updateUser(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useAddresses = (enabled: boolean = true) => {
  const { user } = useAppSelector((state) => state.auth);

  return useQuery<UserAddress[]>({
    queryKey: ['user-addresses', user?._id],
    queryFn: async () => {
      const { data } = await api.get('/auth/addresses');
      return data.addresses || [];
    },
    enabled: enabled && !!user,
    staleTime: 60 * 1000,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (addressData: Omit<UserAddress, '_id'>) => {
      const { data } = await api.post('/auth/addresses', addressData);
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        dispatch(updateUser(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({
      id,
      addressData,
    }: {
      id: string;
      addressData: Partial<UserAddress>;
    }) => {
      const { data } = await api.put(`/auth/addresses/${id}`, addressData);
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        dispatch(updateUser(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/auth/addresses/${id}`);
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        dispatch(updateUser(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.put(`/auth/addresses/${id}/default`);
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        dispatch(updateUser(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ['user-addresses'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.user) {
        dispatch(updateUser(data.user));
      }
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
};

