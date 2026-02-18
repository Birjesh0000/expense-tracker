import { formatCurrency } from '../utils/currencyUtils.js';

describe('currencyUtils', () => {
  describe('formatCurrency', () => {
    it('should format whole number to currency in Indian Rupees', () => {
      const result = formatCurrency(100);
      expect(result).toContain('100');
      expect(result).toContain('₹');
    });

    it('should format decimal to currency with 2 places', () => {
      const result = formatCurrency(50.25);
      expect(result).toContain('50.25');
      expect(result).toContain('₹');
    });

    it('should format currency with thousands separator', () => {
      const result = formatCurrency(1000);
      expect(result).toContain('1,000');
      expect(result).toContain('₹');
    });

    it('should format large currency with multiple separators', () => {
      const result = formatCurrency(1234567.89);
      // Indian format uses different separator pattern (12,34,567.89)
      expect(result).toContain('₹');
      expect(result).toMatch(/12.*34.*567/);
    });

    it('should format zero currency', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0');
      expect(result).toContain('₹');
    });

    it('should format single digit decimal', () => {
      const result = formatCurrency(10.5);
      expect(result).toContain('10.50');
      expect(result).toContain('₹');
    });

    it('should format very small amount', () => {
      const result = formatCurrency(0.01);
      expect(result).toContain('0.01');
      expect(result).toContain('₹');
    });

    it('should format large decimal', () => {
      const result = formatCurrency(999999999.99);
      expect(result).toContain('₹');
    });

    it('should handle string number input', () => {
      const result = formatCurrency('100.50');
      expect(result).toContain('100.50');
      expect(result).toContain('₹');
    });

    it('should handle negative numbers (for display purposes)', () => {
      const result = formatCurrency(-50.25);
      expect(result).toContain('50.25');
    });
  });
});
