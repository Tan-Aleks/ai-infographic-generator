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

interface ListInfographicProps {
  data: AnalysisResult;
  styleSettings: StyleSettings;
}

const ListInfographic: React.FC<ListInfographicProps> = ({ data, styleSettings }) => {
  const colorScheme = getColorScheme(styleSettings.colorScheme);
  const fontSizes = getFontSizes(styleSettings.fontSize);
  const backgroundStyle = getBackgroundStyle(styleSettings.backgroundStyle, colorScheme);

  if (data.keyPoints.length === 0 && data.chartData.categories.length === 0) {
    return (
      <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
        <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
          Списковая инфографика
        </h3>
        <p style={{ fontSize: fontSizes.base }}>Недостаточно данных для построения структурированного списка.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
      <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
        Списковая инфографика
      </h3>
      {/* Ключевые пункты */}
      {data.keyPoints.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2" style={{ fontSize: fontSizes.subtitle, color: colorScheme.textColor }}>
            Ключевые пункты:
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            {data.keyPoints.map((point, index) => (
              <li key={index} style={{ fontSize: fontSizes.base, color: '#6B7280' }}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Категории */}
      {data.chartData.categories.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2" style={{ fontSize: fontSizes.subtitle, color: colorScheme.textColor }}>
            Категории:
          </h4>
          <div className="space-y-4">
            {data.chartData.categories.map((category, index) => (
              <div key={index}>
                <h5 className="font-medium" style={{ fontSize: fontSizes.base, color: colorScheme.textColor }}>
                  {category.name} ({category.count} элементов)
                </h5>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} style={{ fontSize: fontSizes.small, color: '#6B7280' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListInfographic;
