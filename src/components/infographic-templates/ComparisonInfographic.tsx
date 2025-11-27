'use client';
import { getColorScheme, getFontSizes, getBackgroundStyle } from '@/lib/styleHelpers';

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

interface ComparisonInfographicProps {
  data: AnalysisResult;
  styleSettings: StyleSettings;
}

const ComparisonInfographic: React.FC<ComparisonInfographicProps> = ({ data, styleSettings }) => {
  const colorScheme = getColorScheme(styleSettings.colorScheme);
  const fontSizes = getFontSizes(styleSettings.fontSize);
  const backgroundStyle = getBackgroundStyle(styleSettings.backgroundStyle, colorScheme);

  if (data.statistics.length === 0) {
    return (
      <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
        <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
          Сравнительная инфографика
        </h3>
        <p style={{ fontSize: fontSizes.base }}>Недостаточно данных для построения сравнительной таблицы.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
      <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
        Сравнительная инфографика
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y" style={{ borderColor: colorScheme.colors[1] }}>
          <thead style={{ backgroundColor: colorScheme.lightBg }}>
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-medium uppercase tracking-wider" style={{ fontSize: fontSizes.small, color: colorScheme.textColor }}>
                Показатель
              </th>
              <th scope="col" className="px-6 py-3 text-left font-medium uppercase tracking-wider" style={{ fontSize: fontSizes.small, color: colorScheme.textColor }}>
                Значение
              </th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ backgroundColor: '#ffffff', borderColor: colorScheme.colors[0] }}>
            {data.statistics.map((stat, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : colorScheme.lightBg }}>
                <td className="px-6 py-4 whitespace-nowrap font-medium" style={{ fontSize: fontSizes.base, color: colorScheme.textColor }}>
                  {stat.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap" style={{ fontSize: fontSizes.base, color: '#6B7280' }}>
                  {stat.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonInfographic;