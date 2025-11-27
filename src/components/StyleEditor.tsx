'use client';

import { useState } from 'react';
import { Palette, Type, Layout, RotateCcw } from 'lucide-react';

interface StyleSettings {
  colorScheme: string;
  fontSize: string;
  layout: string;
  backgroundStyle: string;
}

interface StyleEditorProps {
  onStyleChange: (settings: StyleSettings) => void;
}

const colorSchemes = [
  { id: 'blue', name: 'Синий', primary: '#3B82F6', secondary: '#1E40AF', colors: ['#EBF8FF', '#3B82F6', '#1E40AF'] },
  { id: 'green', name: 'Зеленый', primary: '#10B981', secondary: '#047857', colors: ['#ECFDF5', '#10B981', '#047857'] },
  { id: 'purple', name: 'Фиолетовый', primary: '#8B5CF6', secondary: '#7C3AED', colors: ['#F3E8FF', '#8B5CF6', '#7C3AED'] },
  { id: 'orange', name: 'Оранжевый', primary: '#F59E0B', secondary: '#D97706', colors: ['#FEF3C7', '#F59E0B', '#D97706'] },
  { id: 'red', name: 'Красный', primary: '#EF4444', secondary: '#DC2626', colors: ['#FEE2E2', '#EF4444', '#DC2626'] },
  { id: 'gray', name: 'Серый', primary: '#6B7280', secondary: '#374151', colors: ['#F9FAFB', '#6B7280', '#374151'] },
];

const fontSizes = [
  { id: 'sm', name: 'Маленький', class: 'text-sm' },
  { id: 'base', name: 'Средний', class: 'text-base' },
  { id: 'lg', name: 'Большой', class: 'text-lg' },
  { id: 'xl', name: 'Очень большой', class: 'text-xl' },
];

const layouts = [
  { id: 'grid', name: 'Сетка', description: 'Элементы в сетке' },
  { id: 'column', name: 'Колонки', description: 'Вертикальные колонки' },
  { id: 'flow', name: 'Поток', description: 'Свободное расположение' },
];

const backgroundStyles = [
  { id: 'solid', name: 'Сплошной', description: 'Однотонный фон' },
  { id: 'gradient', name: 'Градиент', description: 'Плавный переход цветов' },
  { id: 'pattern', name: 'Узор', description: 'Тонкий узор' },
];

export default function StyleEditor({ onStyleChange }: StyleEditorProps) {
  const [settings, setSettings] = useState<StyleSettings>(() => {
    // Загружаем сохраненные настройки из localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('styleSettings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved style settings:', e);
        }
      }
    }
    return {
      colorScheme: 'blue',
      fontSize: 'base',
      layout: 'grid',
      backgroundStyle: 'gradient',
    };
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSettingChange = (key: keyof StyleSettings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onStyleChange(newSettings);
    // Сохраняем настройки в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('styleSettings', JSON.stringify(newSettings));
    }
  };

  const resetToDefaults = () => {
    const defaultSettings: StyleSettings = {
      colorScheme: 'blue',
      fontSize: 'base',
      layout: 'grid',
      backgroundStyle: 'gradient',
    };
    setSettings(defaultSettings);
    onStyleChange(defaultSettings);
    // Сохраняем настройки по умолчанию в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('styleSettings', JSON.stringify(defaultSettings));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div 
        className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Palette className="h-5 w-5 mr-2" />
          Настройки стиля
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetToDefaults();
            }}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Сбросить к настройкам по умолчанию"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-6 space-y-6">
          {/* Цветовая схема */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Цветовая схема
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => handleSettingChange('colorScheme', scheme.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.colorScheme === scheme.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex space-x-1 mb-2">
                    {scheme.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {scheme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Размер шрифта */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Размер шрифта
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {fontSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => handleSettingChange('fontSize', size.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.fontSize === size.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`${size.class} font-medium text-gray-900 dark:text-white mb-1`}>
                    Аа
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    {size.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Макет */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center">
              <Layout className="h-4 w-4 mr-2" />
              Макет
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {layouts.map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => handleSettingChange('layout', layout.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    settings.layout === layout.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    {layout.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {layout.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Фон */}
          <div>
            <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
              Стиль фона
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {backgroundStyles.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => handleSettingChange('backgroundStyle', bg.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    settings.backgroundStyle === bg.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    {bg.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {bg.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Предварительный просмотр текущих настроек */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Текущие настройки:
            </h5>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div>Цвета: {colorSchemes.find(c => c.id === settings.colorScheme)?.name}</div>
              <div>Шрифт: {fontSizes.find(f => f.id === settings.fontSize)?.name}</div>
              <div>Макет: {layouts.find(l => l.id === settings.layout)?.name}</div>
              <div>Фон: {backgroundStyles.find(b => b.id === settings.backgroundStyle)?.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}