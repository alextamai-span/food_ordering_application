import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Configure and create the Redux store
// This is the central state management hub for the app
export const store = configureStore({
  reducer: {
    // 'auth' is the slice name - state.auth contains auth data
    // 'authReducer' handles all auth state updates
    auth: authReducer,
  },
});

// RootState type - use this when accessing state with useSelector
// Example: useSelector((state: RootState) => state.auth.token)
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch type - use this when typing dispatch with useDispatch
// Example: const dispatch = useDispatch<AppDispatch>()
export type AppDispatch = typeof store.dispatch;
