// Утилиты для работы со стилями инфографики

export interface StyleSettings {
  colorScheme: string;
  fontSize: string;
  layout: string;
  backgroundStyle: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  colors: string[];
  textColor: string;
  lightBg: string;
}

// Цветовые схемы
export const colorSchemes: Record<string, ColorScheme> = {
  blue: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    colors: ['#EBF8FF', '#3B82F6', '#1E40AF'],
    textColor: '#1E40AF',
    lightBg: '#EBF8FF',
  },
  green: {
    primary: '#10B981',
    secondary: '#047857',
    colors: ['#ECFDF5', '#10B981', '#047857'],
    textColor: '#047857',
    lightBg: '#ECFDF5',
  },
  purple: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    colors: ['#F3E8FF', '#8B5CF6', '#7C3AED'],
    textColor: '#7C3AED',
    lightBg: '#F3E8FF',
  },
  orange: {
    primary: '#F59E0B',
    secondary: '#D97706',
    colors: ['#FEF3C7', '#F59E0B', '#D97706'],
    textColor: '#D97706',
    lightBg: '#FEF3C7',
  },
  red: {
    primary: '#EF4444',
    secondary: '#DC2626',
    colors: ['#FEE2E2', '#EF4444', '#DC2626'],
    textColor: '#DC2626',
    lightBg: '#FEE2E2',
  },
  gray: {
    primary: '#6B7280',
    secondary: '#374151',
    colors: ['#F9FAFB', '#6B7280', '#374151'],
    textColor: '#374151',
    lightBg: '#F9FAFB',
  },
};

// Размеры шрифтов
export const fontSizes: Record<string, { base: string; title: string; subtitle: string; small: string }> = {
  sm: {
    base: '0.875rem',
    title: '1.25rem',
    subtitle: '1rem',
    small: '0.75rem',
  },
  base: {
    base: '1rem',
    title: '1.5rem',
    subtitle: '1.125rem',
    small: '0.875rem',
  },
  lg: {
    base: '1.125rem',
    title: '1.875rem',
    subtitle: '1.25rem',
    small: '1rem',
  },
  xl: {
    base: '1.25rem',
    title: '2.25rem',
    subtitle: '1.5rem',
    small: '1.125rem',
  },
};

export function getColorScheme(colorSchemeId: string): ColorScheme {
  return colorSchemes[colorSchemeId] || colorSchemes.blue;
}

export function getFontSizes(fontSizeId: string) {
  return fontSizes[fontSizeId] || fontSizes.base;
}

export function getBackgroundStyle(
  backgroundStyleId: string,
  colorScheme: ColorScheme
): React.CSSProperties {
  switch (backgroundStyleId) {
    case 'solid':
      return {
        backgroundColor: '#ffffff',
      };
    case 'gradient':
      return {
        background: `linear-gradient(135deg, ${colorScheme.lightBg} 0%, #ffffff 100%)`,
      };
    case 'pattern':
      return {
        backgroundColor: '#ffffff',
        backgroundImage: `radial-gradient(${colorScheme.colors[0]} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      };
    default:
      return {
        background: `linear-gradient(135deg, ${colorScheme.lightBg} 0%, #ffffff 100%)`,
      };
  }
}

export function getLayoutStyle(layoutId: string): string {
  switch (layoutId) {
    case 'grid':
      return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    case 'column':
      return 'flex flex-col space-y-6';
    case 'flow':
      return 'flex flex-wrap gap-6';
    default:
      return 'grid grid-cols-1 md:grid-cols-2 gap-6';
  }
}

export function hexToRgba(hex: string, alpha: number = 1): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getChartColors(colorScheme: ColorScheme) {
  return {
    backgroundColor: colorScheme.colors.map(color => hexToRgba(color, 0.8)),
    borderColor: colorScheme.colors,
    primaryColor: colorScheme.primary,
    secondaryColor: colorScheme.secondary,
  };
}
