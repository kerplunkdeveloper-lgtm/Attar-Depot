import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, AppliedCoupon } from '@/types';

interface CartState {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  discount: number;
  appliedCoupon: AppliedCoupon | null;
  shipping: number;
  total: number;
}

const calculateTotals = (items: CartItem[], currentCoupon?: AppliedCoupon | null) => {
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  let activeCoupon = currentCoupon || null;

  if (activeCoupon && items.length > 0) {
    if (activeCoupon.minOrderValue && subtotal < activeCoupon.minOrderValue) {
      // Subtotal dropped below minimum requirement -> revoke coupon
      activeCoupon = null;
      discount = 0;
    } else if (activeCoupon.discountType === 'fixed') {
      discount = Math.min(activeCoupon.discountValue, subtotal);
    } else if (activeCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * activeCoupon.discountValue) / 100);
      if (activeCoupon.maxDiscount && activeCoupon.maxDiscount > 0) {
        discount = Math.min(discount, activeCoupon.maxDiscount);
      }
    }

    if (activeCoupon) {
      activeCoupon = {
        ...activeCoupon,
        discountAmount: discount,
      };
    }
  } else {
    activeCoupon = null;
    discount = 0;
  }

  const effectiveTotal = Math.max(0, subtotal - discount);
  const shipping = effectiveTotal > 1999 || items.length === 0 ? 0 : 150;
  const total = effectiveTotal + shipping;

  return { itemsCount, subtotal, discount, appliedCoupon: activeCoupon, shipping, total };
};

const initialState: CartState = {
  items: [],
  itemsCount: 0,
  subtotal: 0,
  discount: 0,
  appliedCoupon: null,
  shipping: 0,
  total: 0,
};

const saveToLocalStorage = (items: CartItem[], coupon: AppliedCoupon | null) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('attar_cart', JSON.stringify(items));
      if (coupon) {
        localStorage.setItem('attar_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('attar_coupon');
      }
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
          const savedItems = localStorage.getItem('attar_cart');
          const savedCoupon = localStorage.getItem('attar_coupon');

          let items: CartItem[] = [];
          let coupon: AppliedCoupon | null = null;

          if (savedItems) {
            items = JSON.parse(savedItems);
          }
          if (savedCoupon) {
            coupon = JSON.parse(savedCoupon);
          }

          state.items = items;
          const totals = calculateTotals(items, coupon);
          state.itemsCount = totals.itemsCount;
          state.subtotal = totals.subtotal;
          state.discount = totals.discount;
          state.appliedCoupon = totals.appliedCoupon;
          state.shipping = totals.shipping;
          state.total = totals.total;
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

      const totals = calculateTotals(state.items, state.appliedCoupon);
      state.itemsCount = totals.itemsCount;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.appliedCoupon = totals.appliedCoupon;
      state.shipping = totals.shipping;
      state.total = totals.total;
      saveToLocalStorage(state.items, state.appliedCoupon);
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

      const totals = calculateTotals(state.items, state.appliedCoupon);
      state.itemsCount = totals.itemsCount;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.appliedCoupon = totals.appliedCoupon;
      state.shipping = totals.shipping;
      state.total = totals.total;
      saveToLocalStorage(state.items, state.appliedCoupon);
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

      const totals = calculateTotals(state.items, state.appliedCoupon);
      state.itemsCount = totals.itemsCount;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.appliedCoupon = totals.appliedCoupon;
      state.shipping = totals.shipping;
      state.total = totals.total;
      saveToLocalStorage(state.items, state.appliedCoupon);
    },

    applyCoupon: (state, action: PayloadAction<AppliedCoupon>) => {
      const totals = calculateTotals(state.items, action.payload);
      state.itemsCount = totals.itemsCount;
      state.subtotal = totals.subtotal;
      state.discount = totals.discount;
      state.appliedCoupon = totals.appliedCoupon;
      state.shipping = totals.shipping;
      state.total = totals.total;
      saveToLocalStorage(state.items, state.appliedCoupon);
    },

    removeCoupon: (state) => {
      const totals = calculateTotals(state.items, null);
      state.itemsCount = totals.itemsCount;
      state.subtotal = totals.subtotal;
      state.discount = 0;
      state.appliedCoupon = null;
      state.shipping = totals.shipping;
      state.total = totals.total;
      saveToLocalStorage(state.items, null);
    },

    clearCart: (state) => {
      state.items = [];
      state.itemsCount = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.appliedCoupon = null;
      state.shipping = 0;
      state.total = 0;
      saveToLocalStorage([], null);
    },
  },
});

export const {
  hydrateCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
