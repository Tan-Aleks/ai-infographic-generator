'use client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getColorScheme, getFontSizes, getBackgroundStyle, getChartColors } from '@/lib/styleHelpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Локальное определение типов
interface AnalysisResult {
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

interface StyleSettings {
  colorScheme: string;
  fontSize: string;
  layout: string;
  backgroundStyle: string;
}

interface StatisticsInfographicProps {
  data: AnalysisResult;
  styleSettings: StyleSettings;
}

const StatisticsInfographic: React.FC<StatisticsInfographicProps> = ({ data, styleSettings }) => {
  // Получаем стили из хелперов
  const colorScheme = getColorScheme(styleSettings.colorScheme);
  const fontSizes = getFontSizes(styleSettings.fontSize);
  const backgroundStyle = getBackgroundStyle(styleSettings.backgroundStyle, colorScheme);
  const chartColors = getChartColors(colorScheme);

  // Используем цвета из выбранной схемы для диаграммы
  const chartData = {
    labels: data.chartData.numbers.map(item => item.label),
    datasets: [
      {
        label: 'Значения',
        data: data.chartData.numbers.map(item => item.value),
        backgroundColor: data.chartData.numbers.map((_, index) => {
          const colorIndex = index % chartColors.backgroundColor.length;
          return chartColors.backgroundColor[colorIndex];
        }),
        borderColor: data.chartData.numbers.map((_, index) => {
          const colorIndex = index % chartColors.borderColor.length;
          return chartColors.borderColor[colorIndex];
        }),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: parseInt(fontSizes.small),
          },
        },
      },
      title: {
        display: true,
        text: 'Статистика',
        font: {
          size: parseInt(fontSizes.subtitle),
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          font: {
            size: parseInt(fontSizes.small),
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: parseInt(fontSizes.small),
          },
        },
      },
    },
  };

  if (data.chartData.numbers.length === 0) {
    return (
      <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
        <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
          Статистическая инфографика
        </h3>
        <p style={{ fontSize: fontSizes.base }}>Недостаточно числовых данных для построения диаграммы.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
      <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
        Статистическая инфографика
      </h3>
      <div className="h-64 mb-4">
        <Bar data={chartData} options={chartOptions} />
      </div>
      {/* Опционально: отображение контекста чисел */}
      {data.chartData.numbers.length > 0 && (
        <div className="mt-4 space-y-2">
          {data.chartData.numbers.slice(0, 3).map((item, index) => (
            <div key={index} style={{ fontSize: fontSizes.small }}>
              <span className="font-medium" style={{ color: colorScheme.textColor }}>
                {item.label}: {item.value}
              </span>
              <p className="text-gray-600 dark:text-gray-300 truncate">
                {item.context}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatisticsInfographic;