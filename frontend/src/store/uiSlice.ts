import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  isCartDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup';
  isAiChatOpen: boolean;
}

const initialState: UiState = {
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isAuthModalOpen: false,
  authModalMode: 'login',
  isAiChatOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCartDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      state.isCartDrawerOpen = action.payload !== undefined ? action.payload : !state.isCartDrawerOpen;
    },
    toggleMobileMenu: (state, action: PayloadAction<boolean | undefined>) => {
      state.isMobileMenuOpen = action.payload !== undefined ? action.payload : !state.isMobileMenuOpen;
    },
    toggleSearch: (state, action: PayloadAction<boolean | undefined>) => {
      state.isSearchOpen = action.payload !== undefined ? action.payload : !state.isSearchOpen;
    },
    openAuthModal: (state, action: PayloadAction<'login' | 'signup' | undefined>) => {
      state.isAuthModalOpen = true;
      if (action.payload) {
        state.authModalMode = action.payload;
      }
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthModalMode: (state, action: PayloadAction<'login' | 'signup'>) => {
      state.authModalMode = action.payload;
    },
    toggleAiChat: (state, action: PayloadAction<boolean | undefined>) => {
      state.isAiChatOpen = action.payload !== undefined ? action.payload : !state.isAiChatOpen;
    },
  },
});

export const {
  toggleCartDrawer,
  toggleMobileMenu,
  toggleSearch,
  openAuthModal,
  closeAuthModal,
  setAuthModalMode,
  toggleAiChat,
} = uiSlice.actions;
export default uiSlice.reducer;
