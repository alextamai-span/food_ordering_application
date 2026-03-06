import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of the auth state
interface AuthState {
  token: string;           // JWT token from login/register
  id: number;              // User ID (if needed for API calls)
  account_type: string;    // 'employee' or 'guest'
  success: boolean;       // Whether user is logged in
}

// Initial state - user starts as not authenticated
const initialState: AuthState = {
  token: '',
  id: 0,
  account_type: '',
  success: false,
};

// Create the auth slice with Redux Toolkit
// This generates actions automatically based on reducers
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action: setAuth - stores user login data in Redux state
    // Called after successful login/register
    setAuth: (state, action: PayloadAction<{ token: string; account_type: string; id: number }>) => {
      state.token = action.payload.token;
      state.account_type = action.payload.account_type;
      state.id = action.payload.id;
      state.success = true;
    },
    
    // Action: logout - clears all auth data from Redux state
    // Called when user logs out
    logout: (state) => {
      state.token = '';
      state.account_type = '';
      state.id = 0;
      state.success = false;
    },
  },
});

// Export actions to use in components
export const { setAuth, logout } = authSlice.actions;

// Export reducer to use in store
export default authSlice.reducer;
