// Utility for dynamic brand theme colors, 5% surface tints, eyebrows, and CSS variables

export function hexToRgba(hex: string, alpha: number): string {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) return `rgba(37, 99, 235, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getThemeTokens(accentColor?: string, primaryColor?: string) {
  const accent = accentColor || '#2563EB';
  const primary = primaryColor || '#064E3B';

  return {
    accent,
    primary,
    // 5% surface tint for non-white sections (e.g. Rich plum 5%, Emerald 5%, etc.)
    surfaceTint: hexToRgba(primary, 0.05),
    surfaceTintAccent: hexToRgba(accent, 0.05),
    surfaceTintHover: hexToRgba(primary, 0.09),
    borderTint: hexToRgba(primary, 0.12),
    borderTintSubtle: hexToRgba(primary, 0.07),
    eyebrowBg: hexToRgba(accent, 0.1),
    eyebrowBorder: hexToRgba(accent, 0.25),
    eyebrowText: accent,
    pillDot: accent,
    iconAccent: accent,
    buttonPrimary: accent,
    buttonPrimaryText: '#FFFFFF',
    accentLight: hexToRgba(accent, 0.15)
  };
}

export function applyThemeCssVariables(accentColor?: string, primaryColor?: string) {
  if (typeof document === 'undefined') return;
  const tokens = getThemeTokens(accentColor, primaryColor);
  const root = document.documentElement;
  root.style.setProperty('--brand-accent', tokens.accent);
  root.style.setProperty('--brand-primary', tokens.primary);
  root.style.setProperty('--brand-tint', tokens.surfaceTint);
  root.style.setProperty('--brand-border', tokens.borderTint);
}

