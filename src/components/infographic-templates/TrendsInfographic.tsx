'use client';
import { getColorScheme, getFontSizes, getBackgroundStyle, hexToRgba } from '@/lib/styleHelpers';

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

interface TrendsInfographicProps {
  data: AnalysisResult;
  styleSettings: StyleSettings;
}

const TrendsInfographic: React.FC<TrendsInfographicProps> = ({ data, styleSettings }) => {
  const colorScheme = getColorScheme(styleSettings.colorScheme);
  const fontSizes = getFontSizes(styleSettings.fontSize);
  const backgroundStyle = getBackgroundStyle(styleSettings.backgroundStyle, colorScheme);

  if (data.themes.length === 0) {
    return (
      <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
        <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
          Анализ трендов
        </h3>
        <p style={{ fontSize: fontSizes.base }}>Недостаточно данных для анализа трендов.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
      <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
        Анализ трендов
      </h3>
      <div className="flex flex-wrap gap-2">
        {data.themes.map((theme, index) => (
          <span 
            key={index} 
            className="px-3 py-1 rounded-full"
            style={{ 
              backgroundColor: hexToRgba(colorScheme.primary, 0.2),
              color: colorScheme.textColor,
              fontSize: fontSizes.small
            }}
          >
            {theme}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrendsInfographic;
