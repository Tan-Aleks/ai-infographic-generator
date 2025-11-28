'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, BarChart3 } from 'lucide-react';
import ChartDisplay from './ChartDisplay';
import InfographicGenerator from './InfographicGenerator';
import InfographicDisplay from './InfographicDisplay'; // Добавляем импорт InfographicDisplay
import ExportPanel from './ExportPanel';
import StyleEditor from './StyleEditor';

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

export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [styleSettings, setStyleSettings] = useState<StyleSettings>(() => {
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
  const [selectedInfographicType, setSelectedInfographicType] = useState<string | null>(null); // Добавляем состояние для типа инфографики

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setText(content);
        };
        reader.readAsText(file);
      }
    },
  });

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Пожалуйста, введите текст для анализа');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при анализе текста');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError('Произошла ошибка при анализе текста. Попробуйте еще раз.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInfographicGeneration = (type: string) => {
    setSelectedInfographicType(type);
    // console.log(`Генерируем инфографику типа: ${type}`);
  };

  const handleStyleChange = (settings: StyleSettings) => {
    setStyleSettings(settings);
    console.log('Новые настройки стиля применены:', settings);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Зона загрузки файлов */}
      <div className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 mb-6">
        <h2 className="text-2xl font-semibold text-white drop-shadow-lg mb-4">
          Загрузите текст для анализа
        </h2>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-white/60 bg-white/10'
              : 'border-white/30 hover:border-white/50 hover:bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-white/70 mb-4" />
          <p className="text-lg text-white/90 mb-2">
            {isDragActive
              ? 'Отпустите файл здесь...'
              : 'Перетащите файл сюда или нажмите для выбора'}
          </p>
          <p className="text-sm text-white/70">
            Поддерживаются файлы: TXT, DOCX, PDF
          </p>
        </div>

        {/* Текстовое поле */}
        <div className="mt-6">
          <label htmlFor="text-input" className="block text-sm font-medium text-white/90 mb-2">
            Или введите текст вручную:
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Вставьте ваш текст здесь..."
            className="w-full h-40 p-3 bg-white/10 border border-white/20 rounded-xl resize-none focus:ring-2 focus:ring-white/30 focus:border-white/40 backdrop-blur-sm text-white placeholder-white/60"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-white/70">
              Символов: {text.length} / 5000
            </span>
            <button
              onClick={analyzeText}
              disabled={isAnalyzing || !text.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4" />
              )}
              <span>{isAnalyzing ? 'Анализирую...' : 'Анализировать текст'}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Результаты анализа */}
      {analysisResult && (
        <div id="analysis-results" className="bg-white/10 dark:bg-gray-800/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
          <h3 className="text-xl font-semibold text-white drop-shadow-lg mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Результаты анализа
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Краткое содержание */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Краткое содержание
              </h4>
              <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                {analysisResult.summary}
              </p>
            </div>

            {/* Ключевые темы */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Основные темы
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.themes.map((theme, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            {/* Ключевые пункты */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ключевые пункты
              </h4>
              <ul className="space-y-2">
                {analysisResult.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                    <span className="text-gray-600 dark:text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Статистика */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Статистика
              </h4>
              <div className="space-y-2">
                {analysisResult.statistics.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">{stat.label}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Визуализация данных */}
      {analysisResult && (
        <div className="mt-6">
          <ChartDisplay 
            chartData={analysisResult.chartData} 
            themes={analysisResult.themes}
          />
        </div>
      )}

      {/* Генератор инфографики */}
      {analysisResult && !selectedInfographicType && ( // Показываем, только если результат есть и тип не выбран
        <div className="mt-6">
          <InfographicGenerator
            data={analysisResult}
            onGenerateInfographic={handleInfographicGeneration}
          />
        </div>
      )}
    
      {/* Отображение инфографики */}
      {analysisResult && selectedInfographicType && ( // Показываем, если результат есть и тип выбран
        <div className="mt-6">
          <InfographicDisplay
            infographicType={selectedInfographicType as 'statistics' | 'comparison' | 'timeline' | 'list' | 'trends' | 'summary'}
            data={analysisResult}
            styleSettings={styleSettings}
          />
        </div>
      )}
    
      {/* Редактор стиля */}
      {analysisResult && (
        <div className="mt-6">
          <StyleEditor onStyleChange={handleStyleChange} />
        </div>
      )}
    
      {/* Панель экспорта */}
      {analysisResult && (
        <div className="mt-6">
          <ExportPanel
            elementId={selectedInfographicType ? "infographic-display" : "analysis-results"} // Экспортируем либо инфографику, либо результаты анализа
            filename="ai-infographic-analysis"
          />
        </div>
      )}
    </div>
  );
}
