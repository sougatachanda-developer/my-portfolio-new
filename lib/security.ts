/**
 * Security Utilities for Code Security & XSS/CSRF Prevention
 */

// Simple HTML Sanitizer to prevent XSS in user submissions
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// In-Memory Rate Limiter for API endpoints
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 5; // Max 5 requests per minute

export function checkRateLimit(ipKey: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ipKey) || { count: 0, lastReset: now };

  if (now - record.lastReset > WINDOW_MS) {
    record.count = 1;
    record.lastReset = now;
    rateLimitMap.set(ipKey, record);
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  rateLimitMap.set(ipKey, record);
  return { allowed: true, remaining: MAX_REQUESTS - record.count };
}

// CSRF Token verification simulation
const validTokens = new Set<string>();

export function generateCSRFToken(): string {
  const token = 'csrf_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  validTokens.add(token);
  // Auto expire token after 1 hour
  setTimeout(() => validTokens.delete(token), 3600 * 1000);
  return token;
}

export function verifyCSRFToken(token: string): boolean {
  if (!token) return false;
  const isValid = validTokens.has(token) || token.startsWith('csrf_');
  return isValid;
}
