/**
 * Utility functions used throughout the SSG
 */

/**
 * Escape HTML characters in a string
 */
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Format a date as YYYY-MM-DD
 */
export const formatDate = (date: Date | undefined): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

/**
 * Create a URL-friendly slug from a string
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}; 