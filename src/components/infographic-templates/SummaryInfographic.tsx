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

interface SummaryInfographicProps {
  data: AnalysisResult;
  styleSettings: StyleSettings;
}

const SummaryInfographic: React.FC<SummaryInfographicProps> = ({ data, styleSettings }) => {
  const colorScheme = getColorScheme(styleSettings.colorScheme);
  const fontSizes = getFontSizes(styleSettings.fontSize);
  const backgroundStyle = getBackgroundStyle(styleSettings.backgroundStyle, colorScheme);

  if (!data.summary || data.summary.trim().length === 0) {
    return (
      <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
        <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
          Краткая сводка
        </h3>
        <p style={{ fontSize: fontSizes.base }}>Недостаточно данных для генерации краткой сводки.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
      <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
        Краткая сводка
      </h3>
      <p 
        className="p-4 rounded"
        style={{ 
          fontSize: fontSizes.base,
          color: '#6B7280',
          backgroundColor: hexToRgba(colorScheme.lightBg, 0.5)
        }}
      >
        {data.summary}
      </p>
    </div>
  );
};

export default SummaryInfographic;
