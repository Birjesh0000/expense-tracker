import { formatCurrency } from '../utils/currencyUtils.js';

describe('currencyUtils', () => {
  describe('formatCurrency', () => {
    it('should format whole number to currency', () => {
      const result = formatCurrency(100);
      expect(result).toBe('$100.00');
    });

    it('should format decimal to currency with 2 places', () => {
      const result = formatCurrency(50.25);
      expect(result).toBe('$50.25');
    });

    it('should format currency with thousands separator', () => {
      const result = formatCurrency(1000);
      expect(result).toBe('$1,000.00');
    });

    it('should format large currency with multiple separators', () => {
      const result = formatCurrency(1234567.89);
      expect(result).toBe('$1,234,567.89');
    });

    it('should format zero currency', () => {
      const result = formatCurrency(0);
      expect(result).toBe('$0.00');
    });

    it('should format single digit decimal', () => {
      const result = formatCurrency(10.5);
      expect(result).toBe('$10.50');
    });

    it('should format very small amount', () => {
      const result = formatCurrency(0.01);
      expect(result).toBe('$0.01');
    });

    it('should format large decimal', () => {
      const result = formatCurrency(999999999.99);
      expect(result).toBe('$999,999,999.99');
    });

    it('should handle string number input', () => {
      const result = formatCurrency('100.50');
      expect(result).toBe('$100.50');
    });

    it('should handle negative numbers (for display purposes)', () => {
      const result = formatCurrency(-50.25);
      expect(result).toContain('50.25');
    });
  });
});
