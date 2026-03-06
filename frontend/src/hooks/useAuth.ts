import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../contexts/store';
import { setAuth, logout } from '../contexts/authSlice';

/**
 * Custom hook to access and manage authentication state
 * Use this in any component that needs auth data or auth actions
 * 
 * Example usage:
 * const { token, login, logout } = useAuth();
 */
export const useAuth = () => {
  // Get Redux dispatch to trigger actions
  const dispatch = useDispatch<AppDispatch>();
  
  // Get auth state from Redux store
  const auth = useSelector((state: RootState) => state.auth);

  // Wrapper function to dispatch setAuth action
  // Takes login credentials and stores them in Redux
  const login = (token: string, id: number, account_type: string) => {
    dispatch(setAuth({ token, id, account_type }));
  };

  // Wrapper function to dispatch logout action
  // Clears all auth data from Redux
  const handleLogout = () => {
    dispatch(logout());
  };

  // Return all auth data and actions for use in components
  return {
    token: auth.token,                    // JWT token (null if not logged in)
    id: auth.id,                          // User ID
    account_type: auth.account_type,      // 'employee' or 'guest'
    success: auth.success,                // Boolean flag for logged in status
    login,                                // Action to set auth state
    logout: handleLogout,                 // Action to clear auth state
  };
};
