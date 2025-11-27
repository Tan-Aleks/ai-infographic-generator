'use client';

import { useState } from 'react';
import { User, LogIn, UserPlus, Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface User {
  id: string;
  name: string;
  email: string;
}

interface HeaderProps {
  user?: User | null;
  onLogin: () => void;
  onRegister: () => void;
  onLogout?: () => void;
}

export default function Header({ user, onLogin, onRegister, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-lg border-b border-white/20 dark:border-gray-700/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white drop-shadow-lg">
                AI Infographic Generator
              </h1>
              <p className="text-xs text-white/70 hidden sm:block">
                Создавайте инфографику с помощью ИИ
              </p>
            </div>
          </div>

          {/* Десктопная навигация */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Переключатель темы */}
            <button
              onClick={toggleTheme}
              className="p-2 text-white/70 hover:text-white transition-colors"
              title={isDarkMode ? 'Светлая тема' : 'Темная тема'}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              /* Аутентифицированный пользователь */
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-white drop-shadow">
                      {user.name}
                    </p>
                    <p className="text-xs text-white/70">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  Выйти
                </button>
              </div>
            ) : (
              /* Неаутентифицированный пользователь */
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLogin}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Войти</span>
                </button>
                <button
                  onClick={onRegister}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Регистрация</span>
                </button>
              </div>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white/70 hover:text-white"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Мобильное выпадающее меню */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-3">
              {/* Переключатель темы */}
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-3 w-full px-2 py-2 text-gray-700 dark:text-gray-300"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span>{isDarkMode ? 'Светлая тема' : 'Темная тема'}</span>
              </button>

              {user ? (
                /* Мобильное меню для аутентифицированного пользователя */
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 px-2 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-2 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Выйти
                  </button>
                </div>
              ) : (
                /* Мобильное меню для неаутентифицированного пользователя */
                <div className="space-y-3">
                  <button
                    onClick={onLogin}
                    className="flex items-center space-x-3 w-full px-2 py-2 text-gray-700 dark:text-gray-300"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Войти</span>
                  </button>
                  <button
                    onClick={onRegister}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-md"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Регистрация</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}