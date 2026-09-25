import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isCartDrawerOpen: boolean;
  isWishlistDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  authRedirectUrl: string | null;
  isAiChatOpen: boolean;
}

const initialState: UiState = {
  isCartDrawerOpen: false,
  isWishlistDrawerOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isAuthModalOpen: false,
  authModalMode: 'login',
  authRedirectUrl: null,
  isAiChatOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCartDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      state.isCartDrawerOpen = action.payload !== undefined ? action.payload : !state.isCartDrawerOpen;
      if (state.isCartDrawerOpen) {
        state.isWishlistDrawerOpen = false;
      }
    },
    toggleWishlistDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      state.isWishlistDrawerOpen = action.payload !== undefined ? action.payload : !state.isWishlistDrawerOpen;
      if (state.isWishlistDrawerOpen) {
        state.isCartDrawerOpen = false;
      }
    },
    toggleMobileMenu: (state, action: PayloadAction<boolean | undefined>) => {
      state.isMobileMenuOpen = action.payload !== undefined ? action.payload : !state.isMobileMenuOpen;
    },
    toggleSearch: (state, action: PayloadAction<boolean | undefined>) => {
      state.isSearchOpen = action.payload !== undefined ? action.payload : !state.isSearchOpen;
    },
    openAuthModal: (
      state,
      action: PayloadAction<
        'login' | 'signup' | { mode?: 'login' | 'signup'; redirectUrl?: string | null } | undefined
      >
    ) => {
      state.isAuthModalOpen = true;
      if (typeof action.payload === 'string') {
        state.authModalMode = action.payload;
        state.authRedirectUrl = null;
      } else if (action.payload) {
        if (action.payload.mode) {
          state.authModalMode = action.payload.mode;
        }
        state.authRedirectUrl = action.payload.redirectUrl ?? null;
      } else {
        state.authRedirectUrl = null;
      }
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
      state.authRedirectUrl = null;
    },
    setAuthModalMode: (state, action: PayloadAction<'login' | 'signup'>) => {
      state.authModalMode = action.payload;
    },
    setAuthRedirectUrl: (state, action: PayloadAction<string | null>) => {
      state.authRedirectUrl = action.payload;
    },
    toggleAiChat: (state, action: PayloadAction<boolean | undefined>) => {
      state.isAiChatOpen = action.payload !== undefined ? action.payload : !state.isAiChatOpen;
    },
  },
});

export const {
  toggleCartDrawer,
  toggleWishlistDrawer,
  toggleMobileMenu,
  toggleSearch,
  openAuthModal,
  closeAuthModal,
  setAuthModalMode,
  setAuthRedirectUrl,
  toggleAiChat,
} = uiSlice.actions;
export default uiSlice.reducer;
