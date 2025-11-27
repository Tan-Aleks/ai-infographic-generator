'use client';

import { useState } from 'react';
import { Download, FileImage, FileText, Printer, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportPanelProps {
  elementId: string;
  filename?: string;
}

export default function ExportPanel({ elementId, filename = 'infographic' }: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const exportAsPNG = async () => {
    setIsExporting(true);
    setExportStatus('Подготовка изображения...');
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Элемент для экспорта не найден');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL();
      link.click();

      setExportStatus('PNG файл успешно загружен!');
    } catch (error) {
      console.error('Ошибка экспорта PNG:', error);
      setExportStatus('Ошибка при экспорте в PNG');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    setExportStatus('Создание PDF...');
    
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Элемент для экспорта не найден');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${filename}.pdf`);

      setExportStatus('PDF файл успешно загружен!');
    } catch (error) {
      console.error('Ошибка экспорта PDF:', error);
      setExportStatus('Ошибка при экспорте в PDF');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const exportAsJSON = () => {
    setIsExporting(true);
    setExportStatus('Сохранение данных...');

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Элемент для экспорта не найден');
      }

      // Извлекаем данные из элемента (это упрощенная версия)
      const data = {
        timestamp: new Date().toISOString(),
        filename: filename,
        content: element.innerText,
        // Здесь можно добавить более структурированные данные
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.download = `${filename}.json`;
      link.href = URL.createObjectURL(blob);
      link.click();

      setExportStatus('JSON файл успешно загружен!');
    } catch (error) {
      console.error('Ошибка экспорта JSON:', error);
      setExportStatus('Ошибка при экспорте в JSON');
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const printInfographic = () => {
    const element = document.getElementById(elementId);
    if (!element) {
      setExportStatus('Элемент для печати не найден');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      setExportStatus('Не удалось открыть окно печати');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Печать инфографики</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif; 
            }
            @media print {
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          ${element.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    
    setExportStatus('Отправлено на печать');
    setTimeout(() => setExportStatus(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Download className="h-5 w-5 mr-2" />
        Экспорт и публикация
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* PNG Export */}
        <button
          onClick={exportAsPNG}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileImage className="h-8 w-8 text-blue-500 mb-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">PNG</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Изображение</span>
        </button>

        {/* PDF Export */}
        <button
          onClick={exportAsPDF}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="h-8 w-8 text-red-500 mb-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">PDF</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Документ</span>
        </button>

        {/* JSON Export */}
        <button
          onClick={exportAsJSON}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="h-8 w-8 text-green-500 mb-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">JSON</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Данные</span>
        </button>

        {/* Print */}
        <button
          onClick={printInfographic}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Printer className="h-8 w-8 text-purple-500 mb-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Печать</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">Принтер</span>
        </button>
      </div>

      {/* Status Message */}
      {exportStatus && (
        <div className={`mt-4 p-3 rounded-lg ${
          exportStatus.includes('Ошибка') 
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            : exportStatus.includes('успешно') || exportStatus.includes('Отправлено')
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
        }`}>
          <p className="text-sm">{exportStatus}</p>
        </div>
      )}

      {/* Loading indicator */}
      {isExporting && (
        <div className="mt-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">Экспортируем...</span>
        </div>
      )}

      {/* Tips */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">💡 Советы:</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          <li>• PNG - для публикации в соцсетях и презентаций</li>
          <li>• PDF - для печати и официальных документов</li>
          <li>• JSON - для сохранения данных и последующего редактирования</li>
          <li>• Печать - для быстрого получения бумажной копии</li>
        </ul>
      </div>
    </div>
  );
}