import { useState, useEffect } from 'react';
import { User, AuthResponse } from '../../app/type';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('https://be-production-0885.up.railway.app/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          console.warn(`Auth check gagal: ${res.status}`);
          return;
        }

        const data: AuthResponse = await res.json();

        if (data?.isLoggedIn && data.user) {
          const avatarPath = data.user.avatar;

          const avatarUrl = avatarPath?.startsWith('http')
            ? avatarPath
            : avatarPath
            ? `https://be-production-0885.up.railway.app${avatarPath}`
            : null;

          setUser({ ...data.user, avatar: avatarUrl });
        } else {
          console.warn('User tidak login');
        }
      } catch (error) {
        console.error('🔥 Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);
    const logout = () => {
    setUser(null); // Reset user context
    localStorage.removeItem('token'); // Optional, kalau kamu pakai token di localStorage
  };
  return { user, loading, logout };
}
