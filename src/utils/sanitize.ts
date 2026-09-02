/**
 * Security and sanitization utilities for HTML rendering and input handling.
 */

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

const HTML_ESCAPE_REGEX = /[&<>"']/g;

/**
 * Escapes unsafe HTML characters to prevent XSS.
 */
export function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return String(str).replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPES[char] || char);
}

/**
 * Validates and sanitizes CSS color values (hex, rgb/rgba, hsl/hsla, or standard safe keywords).
 * Disallows semicolons, braces, quotes, or expressions that could break out of CSS rules.
 */
const SAFE_COLOR_REGEX = /^(?:#[0-9a-fA-F]{3,8}|(?:rgb|hsl)a?\([^;{}]+\)|[a-zA-Z]{3,20})$/;

export function sanitizeCssColor(color: string | undefined | null, fallback = ''): string {
  if (!color) return fallback;
  const trimmed = color.trim();
  return SAFE_COLOR_REGEX.test(trimmed) ? trimmed : fallback;
}

/**
 * Sanitizes URLs to ensure they only use safe protocols (http, https, mailto) or root-relative paths.
 * Blocks dangerous schemes such as javascript:, vbscript:, data:, etc.
 */
export function sanitizeUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return escapeHtml(trimmed);
  }
  try {
    const parsed = new URL(trimmed);
    if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return escapeHtml(trimmed);
    }
  } catch {
    // Invalid URL format
  }
  return undefined;
}
