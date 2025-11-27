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

interface TimelineInfographicProps {
  data: AnalysisResult;
  styleSettings: StyleSettings;
}

const TimelineInfographic: React.FC<TimelineInfographicProps> = ({ data, styleSettings }) => {
  const colorScheme = getColorScheme(styleSettings.colorScheme);
  const fontSizes = getFontSizes(styleSettings.fontSize);
  const backgroundStyle = getBackgroundStyle(styleSettings.backgroundStyle, colorScheme);

  if (data.chartData.timeline.length === 0) {
    return (
      <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
        <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
          Временная шкала
        </h3>
        <p style={{ fontSize: fontSizes.base }}>Недостаточно данных для построения временной шкалы.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg shadow-md" style={backgroundStyle}>
      <h3 className="font-bold mb-4" style={{ fontSize: fontSizes.title, color: colorScheme.textColor }}>
        Временная шкала
      </h3>
      <div className="relative">
        {/* Линия времени */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: colorScheme.colors[1] }}></div>
        <ul className="relative space-y-6 pl-10">
          {data.chartData.timeline.map((item, index) => (
            <li key={index} className="relative">
              {/* Точка на линии */}
              <div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-4" 
                style={{ backgroundColor: colorScheme.primary, borderColor: '#ffffff' }}
              ></div>
              <div className="p-4 rounded-lg shadow" style={{ backgroundColor: colorScheme.lightBg }}>
                <h4 className="font-bold" style={{ fontSize: fontSizes.subtitle, color: colorScheme.textColor }}>
                  {item.period}
                </h4>
                <ul className="mt-2 space-y-1">
                  {item.events.map((event, eventIndex) => (
                    <li key={eventIndex} style={{ fontSize: fontSizes.small, color: '#6B7280' }}>
                      • {event}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TimelineInfographic;