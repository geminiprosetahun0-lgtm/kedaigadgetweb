export const sanitizeInput = (val: string, maxLen = 120): string => {
  if (!val || typeof val !== 'string') return '';
  return val
    .slice(0, maxLen)
    .replace(/[<>'"&;`\\]/g, '')
    .trim();
};

export const sanitizePhone = (val: string): string => {
  if (!val || typeof val !== 'string') return '';
  return val.replace(/[^\d+]/g, '').slice(0, 16);
};

export const hashPin = async (pin: string, salt = 'kedaigadget_salt_sec_2026'): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

export const constantTimeCompare = (a: string, b: string): boolean => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

export class ClientRateLimiter {
  private timestamps: number[] = [];
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs);
    if (this.timestamps.length >= this.maxAttempts) {
      return false;
    }
    this.timestamps.push(now);
    return true;
  }

  remainingTime(): number {
    if (this.timestamps.length === 0) return 0;
    const oldest = this.timestamps[0];
    const diff = this.windowMs - (Date.now() - oldest);
    return diff > 0 ? Math.ceil(diff / 1000) : 0;
  }
}
