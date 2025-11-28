'use client';

import { useState } from 'react';
import { BarChart3, PieChart, Clock, List, TrendingUp, FileImage } from 'lucide-react';

interface InfographicData {
  keyPoints: string[];
  statistics: Array<{ label: string; value: string }>;
  themes: string[];
  summary: string;
  chartData: {
    numbers: Array<{ label: string; value: number; context: string }>;
    categories: Array<{ name: string; items: string[]; count: number }>;
    timeline: Array<{ period: string; events: string[] }>;
  };
}

type InfographicType = 'statistics' | 'comparison' | 'timeline' | 'list' | 'trends' | 'summary';

interface InfographicGeneratorProps {
  data: InfographicData;
  onGenerateInfographic: (type: InfographicType) => void;
}

const infographicTypes = [
  {
    id: 'statistics',
    name: 'Статистическая инфографика',
    description: 'Диаграммы и графики с числовыми данными',
    icon: BarChart3,
    color: 'from-blue-500 to-blue-600',
    suitable: (data: InfographicData) => data.chartData.numbers.length > 0
  },
  {
    id: 'comparison',
    name: 'Сравнительная таблица',
    description: 'Сравнение ключевых показателей',
    icon: PieChart,
    color: 'from-green-500 to-green-600',
    suitable: (data: InfographicData) => data.statistics.length > 2
  },
  {
    id: 'timeline',
    name: 'Временная шкала',
    description: 'Хронология событий и процессов',
    icon: Clock,
    color: 'from-purple-500 to-purple-600',
    suitable: (data: InfographicData) => data.chartData.timeline.length > 0
  },
  {
    id: 'list',
    name: 'Структурированный список',
    description: 'Организованное представление информации',
    icon: List,
    color: 'from-orange-500 to-orange-600',
    suitable: (data: InfographicData) => data.keyPoints.length > 2
  },
  {
    id: 'trends',
    name: 'Анализ трендов',
    description: 'Тенденции и закономерности',
    icon: TrendingUp,
    color: 'from-pink-500 to-pink-600',
    suitable: (data: InfographicData) => data.themes.length > 3
  },
  {
    id: 'summary',
    name: 'Краткая сводка',
    description: 'Основные выводы и заключения',
    icon: FileImage,
    color: 'from-indigo-500 to-indigo-600',
    suitable: (data: InfographicData) => data.summary.length > 50
  }
];

export default function InfographicGenerator({ data, onGenerateInfographic }: InfographicGeneratorProps) {
  const [selectedType, setSelectedType] = useState<InfographicType | null>(null);

  const handleSelectType = (type: InfographicType) => {
    // Устанавливаем выбранный тип, но не вызываем генерацию
    setSelectedType(type);
  };

  const handleGenerate = () => {
    // Вызываем генерацию только при нажатии на кнопку
    if (selectedType) {
      onGenerateInfographic(selectedType);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        🎨 Выберите тип инфографики
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {infographicTypes.map((type) => {
          const Icon = type.icon;
          const isSuitable = type.suitable(data);
          
          return (
            <div
              key={type.id}
              className={`relative rounded-lg border-2 transition-all cursor-pointer ${
                isSuitable
                  ? 'border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                  : 'border-gray-100 dark:border-gray-700 opacity-50 cursor-not-allowed'
              } ${
                selectedType === type.id
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : ''
              }`}
              onClick={() => isSuitable && handleSelectType(type.id as InfographicType)}
            >
              <div className="p-4">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${type.color} mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {type.name}
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {type.description}
                </p>

                {isSuitable ? (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Подходящие данные найдены
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400 text-sm">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    Недостаточно данных
                  </div>
                )}
              </div>
              
              {selectedType === type.id && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-md font-medium">
                    Выбрано
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Кнопка "Применить и сгенерировать" */}
      {selectedType && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors font-medium shadow-md"
          >
            Применить и сгенерировать
          </button>
        </div>
      )}

      {/* Предварительный просмотр выбранного типа */}
      {selectedType && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Предварительный просмотр
          </h4>
          
          {selectedType === 'statistics' && (
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Будет создана статистическая инфографика с диаграммами:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 ml-4">
                {data.chartData.numbers.slice(0, 3).map((item, index) => (
                  <li key={index}>{item.label}: {item.value}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedType === 'comparison' && (
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Будет создана сравнительная таблица с показателями:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 ml-4">
                {data.statistics.slice(0, 3).map((stat, index) => (
                  <li key={index}>{stat.label}: {stat.value}</li>
                ))}
              </ul>
            </div>
          )}

          {selectedType === 'timeline' && (
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Будет создана временная шкала с периодами:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 ml-4">
                {data.chartData.timeline.slice(0, 3).map((item, index) => (
                  <li key={index}>{item.period} - {item.events.length} событий</li>
                ))}
              </ul>
            </div>
          )}

          {selectedType === 'list' && (
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Будет создан структурированный список ключевых пунктов:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 ml-4">
                {data.keyPoints.slice(0, 3).map((point, index) => (
                  <li key={index}>{point.substring(0, 50)}...</li>
                ))}
              </ul>
            </div>
          )}

          {selectedType === 'trends' && (
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Будет создан анализ трендов по темам:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.themes.slice(0, 5).map((theme, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-sm">
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selectedType === 'summary' && (
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Будет создана краткая сводка:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 p-3 rounded">
                {data.summary.substring(0, 200)}...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}