'use client'; // Указываем, что это клиентский компонент
import { ReactElement } from 'react'; // Импортируем ReactElement для типизации
import StatisticsInfographic from './infographic-templates/StatisticsInfographic';
import ComparisonInfographic from './infographic-templates/ComparisonInfographic';
import TimelineInfographic from './infographic-templates/TimelineInfographic';
import ListInfographic from './infographic-templates/ListInfographic';
import TrendsInfographic from './infographic-templates/TrendsInfographic';
import SummaryInfographic from './infographic-templates/SummaryInfographic';

// Тип для выбранного типа инфографики
type InfographicType = 'statistics' | 'comparison' | 'timeline' | 'list' | 'trends' | 'summary';

// Определяем интерфейсы AnalysisResult и StyleSettings локально
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

// Пропсы для компонента
interface InfographicDisplayProps {
  infographicType: InfographicType;
  data: AnalysisResult;
  styleSettings: StyleSettings;
}

// Основной компонент
export default function InfographicDisplay({ infographicType, data, styleSettings }: InfographicDisplayProps) {
  // Объект-мэппинг для выбора шаблона
  const infographicMap: Record<InfographicType, ReactElement> = {
    statistics: <StatisticsInfographic data={data} styleSettings={styleSettings} />,
    comparison: <ComparisonInfographic data={data} styleSettings={styleSettings} />,
    timeline: <TimelineInfographic data={data} styleSettings={styleSettings} />,
    list: <ListInfographic data={data} styleSettings={styleSettings} />,
    trends: <TrendsInfographic data={data} styleSettings={styleSettings} />,
    summary: <SummaryInfographic data={data} styleSettings={styleSettings} />,
  };

  // Возвращаем соответствующий шаблон
  return (
    <div id="infographic-display" className="w-full max-w-4xl mx-auto">
      {infographicMap[infographicType]}
    </div>
  );
}