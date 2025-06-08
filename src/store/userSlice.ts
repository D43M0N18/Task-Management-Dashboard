import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isAuthenticated: boolean;
  isDarkMode: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  twoFactorEnabled: boolean;
  user: {
    email: string;
  } | null;
}

const initialState: UserState = {
  isAuthenticated: true,
  isDarkMode: false,
  emailNotifications: true,
  pushNotifications: true,
  twoFactorEnabled: false,
  user: {
    email: 'user@example.com'
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string }>) => {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email };
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    toggleEmailNotifications: (state) => {
      state.emailNotifications = !state.emailNotifications;
    },
    togglePushNotifications: (state) => {
      state.pushNotifications = !state.pushNotifications;
    },
    toggleTwoFactor: (state) => {
      state.twoFactorEnabled = !state.twoFactorEnabled;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const {
  login,
  toggleDarkMode,
  toggleEmailNotifications,
  togglePushNotifications,
  toggleTwoFactor,
  logout,
} = userSlice.actions;

export default userSlice.reducer; 