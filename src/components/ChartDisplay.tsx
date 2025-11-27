'use client';

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Регистрируем компоненты Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ChartData {
  numbers: Array<{ label: string; value: number; context: string }>;
  categories: Array<{ name: string; items: string[]; count: number }>;
  timeline: Array<{ period: string; events: string[] }>;
}

interface ChartDisplayProps {
  chartData: ChartData;
  themes: string[];
}

export default function ChartDisplay({ chartData, themes }: ChartDisplayProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Данные для столбчатой диаграммы чисел
  const numbersChartData = {
    labels: chartData.numbers.map((item, index) => `Значение ${index + 1}`),
    datasets: [
      {
        label: 'Числовые данные',
        data: chartData.numbers.map(item => item.value),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Данные для круговой диаграммы тем
  const themesChartData = {
    labels: themes.slice(0, 6),
    datasets: [
      {
        label: 'Частота тем',
        data: themes.slice(0, 6).map((_, index) => 6 - index), // Примерные веса
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Данные для линейного графика временной шкалы
  const timelineChartData = {
    labels: chartData.timeline.map(item => item.period),
    datasets: [
      {
        label: 'События по времени',
        data: chartData.timeline.map(item => item.events.length),
        fill: false,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Анализ данных',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Основные темы',
      },
    },
  };

  if (chartData.numbers.length === 0 && chartData.categories.length === 0 && chartData.timeline.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          📊 Визуализация данных
        </h3>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📈</div>
          <p className="text-gray-600 dark:text-gray-300">
            Недостаточно данных для создания диаграмм.
            <br />
            Попробуйте добавить текст с числовыми значениями или списками.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={chartContainerRef} className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
      <h3 className="text-xl font-semibold text-white drop-shadow-lg mb-6 flex items-center">
        📊 Визуализация данных
      </h3>

      <div className="grid gap-8">
        {/* Столбчатая диаграмма числовых данных */}
        {chartData.numbers.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Числовые показатели
            </h4>
            <div className="h-64">
              <Bar data={numbersChartData} options={chartOptions} />
            </div>
            
            {/* Контекст чисел */}
            <div className="mt-4 space-y-2">
              {chartData.numbers.slice(0, 3).map((item, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.label}: {item.value}
                  </span>
                  <p className="text-gray-600 dark:text-gray-300 truncate">
                    {item.context}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Круговая диаграмма тем */}
        {themes.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Ключевые темы
            </h4>
            <div className="h-64">
              <Pie data={themesChartData} options={pieOptions} />
            </div>
          </div>
        )}

        {/* Линейный график временной шкалы */}
        {chartData.timeline.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Временная шкала
            </h4>
            <div className="h-64">
              <Line data={timelineChartData} options={chartOptions} />
            </div>
            
            {/* События по периодам */}
            <div className="mt-4 space-y-2">
              {chartData.timeline.slice(0, 3).map((item, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.period}:
                  </span>
                  <ul className="ml-4 list-disc text-gray-600 dark:text-gray-300">
                    {item.events.map((event, eventIndex) => (
                      <li key={eventIndex} className="truncate">{event}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Категории и списки */}
        {chartData.categories.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Структурированные данные
            </h4>
            {chartData.categories.map((category, index) => (
              <div key={index} className="mb-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                  {category.name} ({category.count} элементов)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="bg-white dark:bg-gray-600 p-2 rounded text-sm text-gray-700 dark:text-gray-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}