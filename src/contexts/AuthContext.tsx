'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Проверяем, что мы на клиенте
  useEffect(() => {
    setIsClient(true);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Простая проверка для демонстрации
      if (email === 'demo@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          name: 'Демо Пользователь',
          email: 'demo@example.com',
        };
        
        setUser(userData);
        
        // Сохраняем в localStorage только на клиенте
        if (isClient) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        return true;
      } else {
        // Для других email создаем пользователя автоматически
        const userData: User = {
          id: Date.now().toString(),
          name: email.split('@')[0],
          email: email,
        };
        
        setUser(userData);
        
        if (isClient) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        return true;
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  const register = useCallback(async (name: string, email: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
      };
      
      setUser(userData);
      
      // Сохраняем в localStorage только на клиенте
      if (isClient) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isClient]);

  const logout = useCallback(() => {
    setUser(null);
    if (isClient) {
      localStorage.removeItem('user');
    }
  }, [isClient]);

  // Восстановление пользователя из localStorage при загрузке
  useEffect(() => {
    if (!isClient) return;
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Ошибка парсинга данных пользователя:', error);
        localStorage.removeItem('user');
      }
    }
  }, [isClient]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}