import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const calculateTotals = (items: CartItem[]) => {
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;
  return { itemsCount, subtotal, shipping, total };
};

const initialState: CartState = {
  items: [],
  itemsCount: 0,
  subtotal: 0,
  shipping: 0,
  total: 0,
};

const saveToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('attar_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart: (state) => {
      if (typeof window !== 'undefined') {
        try {
          const saved = localStorage.getItem('attar_cart');
          if (saved) {
            state.items = JSON.parse(saved);
            const totals = calculateTotals(state.items);
            state.itemsCount = totals.itemsCount;
            state.subtotal = totals.subtotal;
            state.shipping = totals.shipping;
            state.total = totals.total;
          }
        } catch (e) {
          console.error('Failed to hydrate cart', e);
        }
      }
    },

    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(
        item =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size
      );

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      const totals = calculateTotals(state.items);
      state.itemsCount = totals.itemsCount;
      state.subtotal = totals.subtotal;
      state.shipping = totals.shipping;
      state.total = totals.total;
      saveToLocalStorage(state.items);
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; size: string; quantity: number }>
    ) => {
      const { productId, size, quantity } = action.payload;
      const index = state.items.findIndex(
        item => item.productId === productId && item.size === size
      );

      if (index > -1) {
        if (quantity <= 0) {
          state.items.splice(index, 1);
        } else {
          state.items[index].quantity = quantity;
        }
      }

      const totals = calculateTotals(state.items);
      state.itemsCount = totals.itemsCount;
      state.subtotal = totals.subtotal;
      state.shipping = totals.shipping;
      state.total = totals.total;
      saveToLocalStorage(state.items);
    },

    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string; size: string }>
    ) => {
      state.items = state.items.filter(
        item =>
          !(
            item.productId === action.payload.productId &&
            item.size === action.payload.size
          )
      );

      const totals = calculateTotals(state.items);
      state.itemsCount = totals.itemsCount;
      state.subtotal = totals.subtotal;
      state.shipping = totals.shipping;
      state.total = totals.total;
      saveToLocalStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.itemsCount = 0;
      state.subtotal = 0;
      state.shipping = 0;
      state.total = 0;
      saveToLocalStorage([]);
    },
  },
});

export const { hydrateCart, addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
