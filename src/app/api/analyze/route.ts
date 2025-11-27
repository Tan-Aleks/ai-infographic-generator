import { NextRequest, NextResponse } from 'next/server';
// import { HfInference } from '@huggingface/inference';

// Для будущего использования с Hugging Face API
// const hf = new HfInference();

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

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Текст не предоставлен или имеет неверный формат' },
        { status: 400 }
      );
    }

    // Ограничиваем длину текста
    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Текст слишком длинный. Максимум 5000 символов.' },
        { status: 400 }
      );
    }

    console.log('Анализирую текст длиной:', text.length);

    // Простой анализ текста без внешних API (для начала)
    const analysisResult = await analyzeTextLocally(text);

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Ошибка анализа:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при анализе текста' },
      { status: 500 }
    );
  }
}

// Функция локального анализа текста
async function analyzeTextLocally(text: string): Promise<AnalysisResult> {
  // Базовый анализ текста
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const avgWordsPerSentence = Math.round(wordCount / sentenceCount);

  // Извлечение чисел из текста с контекстом
  const numberMatches = text.match(/\d+(?:[.,]\d+)?%?/g) || [];
  const numbersWithContext: Array<{ label: string; value: number; context: string }> = [];
  
  numberMatches.forEach((match, index) => {
    const numValue = parseFloat(match.replace(/[%,]/g, '.'));
    if (!isNaN(numValue)) {
      // Находим контекст вокруг числа
      const matchIndex = text.indexOf(match);
      const contextStart = Math.max(0, matchIndex - 50);
      const contextEnd = Math.min(text.length, matchIndex + match.length + 50);
      const context = text.slice(contextStart, contextEnd).trim();
      
      numbersWithContext.push({
        label: `Значение ${index + 1}`,
        value: numValue,
        context: context
      });
    }
  });

  // Извлечение категорий (элементы списков)
  const listItems = text.match(/[-•]\s*([^\n]+)/g) || [];
  const categories: Array<{ name: string; items: string[]; count: number }> = [];
  
  if (listItems.length > 0) {
    categories.push({
      name: 'Основные пункты',
      items: listItems.map(item => item.replace(/[-•]\s*/, '').trim()),
      count: listItems.length
    });
  }

  // Поиск временных периодов
  const timelineMatches = text.match(/\b(\d{4})\b|\b(январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)\w*\b/gi) || [];
  const timeline: Array<{ period: string; events: string[] }> = [];
  
  timelineMatches.forEach(period => {
    const periodIndex = text.indexOf(period);
    const sentenceStart = text.lastIndexOf('.', periodIndex) + 1;
    const sentenceEnd = text.indexOf('.', periodIndex);
    const sentence = text.slice(sentenceStart, sentenceEnd === -1 ? text.length : sentenceEnd).trim();
    
    if (sentence) {
      timeline.push({
        period: period,
        events: [sentence]
      });
    }
  });
  
  // Простое извлечение ключевых слов (наиболее частые слова, исключая стоп-слова)
  const stopWords = ['и', 'в', 'на', 'с', 'по', 'для', 'от', 'до', 'при', 'за', 'под', 'над', 'из', 'к', 'у', 'о', 'об', 'про', 'через', 'между', 'что', 'как', 'где', 'когда', 'кто', 'который', 'которая', 'которое', 'это', 'то', 'все', 'весь', 'его', 'её', 'их', 'так', 'также', 'или', 'но', 'а', 'да', 'нет', 'не', 'ни'];
  
  const wordFrequency: { [key: string]: number } = {};
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
    if (cleanWord.length > 3 && !stopWords.includes(cleanWord)) {
      wordFrequency[cleanWord] = (wordFrequency[cleanWord] || 0) + 1;
    }
  });

  const sortedWords = Object.entries(wordFrequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const themes = sortedWords.map(([word]) => word);

  // Генерация ключевых пунктов (первые предложения и предложения с числами)
  const keyPoints: string[] = [];
  
  // Добавляем первое предложение как ключевой пункт
  if (sentences.length > 0) {
    keyPoints.push(sentences[0].trim());
  }
  
  // Добавляем предложения с числами
  const sentencesWithNumbers = sentences
    .filter(sentence => /\d+/.test(sentence))
    .slice(0, 3);
  
  keyPoints.push(...sentencesWithNumbers.map(s => s.trim()));

  // Убираем дубликаты и ограничиваем количество
  const uniqueKeyPoints = [...new Set(keyPoints)].slice(0, 4);

  // Создание краткого содержания (первые 2-3 предложения)
  const summary = sentences.slice(0, 3).join('. ').trim();

  // Статистика
  const statistics = [
    { label: 'Количество слов', value: wordCount.toString() },
    { label: 'Количество предложений', value: sentenceCount.toString() },
    { label: 'Слов в предложении (среднее)', value: avgWordsPerSentence.toString() },
    { label: 'Найдено чисел', value: numbersWithContext.length.toString() },
  ];

  return {
    keyPoints: uniqueKeyPoints,
    statistics,
    themes: themes.slice(0, 6),
    summary: summary || 'Не удалось создать краткое содержание',
    chartData: {
      numbers: numbersWithContext.slice(0, 10), // Ограничиваем количество
      categories,
      timeline: timeline.slice(0, 5) // Ограничиваем количество
    }
  };
}