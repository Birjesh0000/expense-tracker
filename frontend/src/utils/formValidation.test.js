import { validateField, validateForm } from '../utils/formValidation.js';

describe('formValidation', () => {
  describe('validateField', () => {
    // ===== AMOUNT VALIDATION =====
    describe('amount field', () => {
      it('should return error for empty amount', () => {
        const error = validateField('amount', '');
        expect(error).toBeTruthy();
      });

      it('should return error for negative amount', () => {
        const error = validateField('amount', '-50');
        expect(error).toBeTruthy();
      });

      it('should return error for zero amount', () => {
        const error = validateField('amount', '0');
        expect(error).toBeTruthy();
      });

      it('should return error for amount exceeding max limit', () => {
        const error = validateField('amount', '1000000000');
        expect(error).toBeTruthy();
      });

      it('should return no error for valid amount', () => {
        const error = validateField('amount', '50.25');
        expect(!error).toBeTruthy();
      });

      it('should return no error for large valid amount', () => {
        const error = validateField('amount', '999999998.99');
        expect(!error).toBeTruthy();
      });

      it('should return no error for whole number amount', () => {
        const error = validateField('amount', '100');
        expect(!error).toBeTruthy();
      });
    });

    // ===== CATEGORY VALIDATION =====
    describe('category field', () => {
      it('should return error for empty category', () => {
        const error = validateField('category', '');
        expect(error).toBeTruthy();
      });

      it('should return no error for valid category', () => {
        const error = validateField('category', 'Food');
        expect(!error).toBeTruthy();
      });

      it('should return no error for single character category', () => {
        const error = validateField('category', 'A');
        expect(!error).toBeTruthy();
      });

      it('should return no error for 100 character category', () => {
        const longCategory = 'A'.repeat(100);
        const error = validateField('category', longCategory);
        expect(!error).toBeTruthy();
      });

      it('should return error for category exceeding 100 characters', () => {
        const tooLongCategory = 'A'.repeat(101);
        const error = validateField('category', tooLongCategory);
        expect(error).toBeTruthy();
      });
    });

    // ===== DESCRIPTION VALIDATION =====
    describe('description field', () => {
      it('should return error for empty description', () => {
        const error = validateField('description', '');
        expect(error).toBeTruthy();
      });

      it('should return no error for valid description', () => {
        const error = validateField('description', 'Lunch at restaurant');
        expect(!error).toBeTruthy();
      });

      it('should return no error for single character description', () => {
        const error = validateField('description', 'A');
        expect(!error).toBeTruthy();
      });

      it('should return no error for 500 character description', () => {
        const longDesc = 'A'.repeat(500);
        const error = validateField('description', longDesc);
        expect(!error).toBeTruthy();
      });

      it('should return error for description exceeding 500 characters', () => {
        const tooLongDesc = 'A'.repeat(501);
        const error = validateField('description', tooLongDesc);
        expect(error).toBeTruthy();
      });
    });

    // ===== DATE VALIDATION =====
    describe('date field', () => {
      it('should return error for empty date', () => {
        const error = validateField('date', '');
        expect(error).toBeTruthy();
      });

      it('should return error for future date', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        const dateString = futureDate.toISOString().split('T')[0];
        
        const error = validateField('date', dateString);
        expect(error).toBeTruthy();
      });

      it('should return no error for today date', () => {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        
        const error = validateField('date', dateString);
        expect(!error).toBeTruthy();
      });

      it('should return no error for past date', () => {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 10);
        const dateString = pastDate.toISOString().split('T')[0];
        
        const error = validateField('date', dateString);
        expect(!error).toBeTruthy();
      });
    });
  });

  describe('validateForm', () => {
    it('should return valid for complete form', () => {
      const formData = {
        amount: '50.25',
        category: 'Food',
        description: 'Lunch',
        date: '2026-02-15',
      };
      
      const result = validateForm(formData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it('should return invalid for form with empty amount', () => {
      const formData = {
        amount: '',
        category: 'Food',
        description: 'Lunch',
        date: '2026-02-15',
      };
      
      const result = validateForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).toBeTruthy();
    });

    it('should return invalid for form with empty category', () => {
      const formData = {
        amount: '50.25',
        category: '',
        description: 'Lunch',
        date: '2026-02-15',
      };
      
      const result = validateForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.category).toBeTruthy();
    });

    it('should return invalid for form with multiple errors', () => {
      const formData = {
        amount: '-50',
        category: '',
        description: '',
        date: '',
      };
      
      const result = validateForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.amount).toBeTruthy();
      expect(result.errors.category).toBeTruthy();
      expect(result.errors.description).toBeTruthy();
      expect(result.errors.date).toBeTruthy();
    });
  });
});
