import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size?: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  fragranceFamily?: string;
  tagline?: string;
  gender?: string;
}

interface WishlistState {
  items: WishlistItem[];
  itemsCount: number;
}

const initialState: WishlistState = {
  items: [],
  itemsCount: 0,
};

const saveWishlistToLocalStorage = (items: WishlistItem[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('attar_wishlist', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    hydrateWishlist: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('attar_wishlist');
          if (saved) {
            state.items = JSON.parse(saved);
            state.itemsCount = state.items.length;
          }
        } catch (e) {
          console.error('Failed to hydrate wishlist', e);
        }
      }
    },

    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.some(
        (item) => item.productId === action.payload.productId
      );
      if (!exists) {
        state.items.unshift(action.payload);
        state.itemsCount = state.items.length;
        saveWishlistToLocalStorage(state.items);
      }
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      state.itemsCount = state.items.length;
      saveWishlistToLocalStorage(state.items);
    },

    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const index = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (index > -1) {
        state.items.splice(index, 1);
      } else {
        state.items.unshift(action.payload);
      }
      state.itemsCount = state.items.length;
      saveWishlistToLocalStorage(state.items);
    },

    clearWishlist: (state) => {
      state.items = [];
      state.itemsCount = 0;
      saveWishlistToLocalStorage([]);
    },
  },
});

export const {
  hydrateWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
