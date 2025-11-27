'use client';

import { useState } from 'react';
import TextAnalyzer from '../components/TextAnalyzer';
import Header from '../components/Header';
import AuthModals from '../components/AuthModals';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </ThemeProvider>
  );
}

function HomePage() {
  const { user, login, register, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (success) {
      setIsLoginOpen(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    const success = await register(name, email, password);
    if (success) {
      setIsRegisterOpen(false);
    }
  };

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleCloseModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-10"></div>
        </div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Auth Modals */}
        <AuthModals
          isLoginOpen={isLoginOpen}
          isRegisterOpen={isRegisterOpen}
          onClose={handleCloseModals}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onSwitchToRegister={handleSwitchToRegister}
          onSwitchToLogin={handleSwitchToLogin}
        />
        
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <Header
            user={user}
            onLogin={() => setIsLoginOpen(true)}
            onRegister={() => setIsRegisterOpen(true)}
            onLogout={logout}
          />
          
          <div className="flex-1 container mx-auto px-4 py-8">
            <main>
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">
                  AI Infographic Generator
                </h1>
                <p className="text-lg text-white/90 drop-shadow max-w-2xl mx-auto">
                  Превратите ваш текст в красивую инфографику с помощью искусственного интеллекта
                </p>
              </div>
              
              <TextAnalyzer />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
