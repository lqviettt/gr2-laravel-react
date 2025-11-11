import { useState, useEffect, useContext, createContext } from 'react';
import { toast } from 'react-toastify';

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // Token invalid, remove it
        localStorage.removeItem('auth_token');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success('Đăng nhập thành công!');
        return { success: true };
      } else {
        toast.error(data.message || 'Đăng nhập thất bại');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Có lỗi xảy ra khi đăng nhập');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('auth_token', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        toast.success('Đăng ký thành công!');
        return { success: true };
      } else {
        toast.error(data.message || 'Đăng ký thất bại');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Có lỗi xảy ra khi đăng ký');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
      toast.info('Đã đăng xuất');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast.success('Cập nhật thông tin thành công!');
        return { success: true };
      } else {
        toast.error(data.message || 'Cập nhật thất bại');
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật');
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;