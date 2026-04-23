import { userSchema } from '../validators/userValidator';

describe('userValidator', () => {
  describe('Valid user data', () => {
    it('should validate a complete valid user', () => {
      const result = userSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Name validation', () => {
    it('should fail when name is missing', () => {
      const result = userSchema.safeParse({ email: 'john@example.com', age: 30 });
      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find(issue => issue.path[0] === 'name');
        expect(nameError?.message).toBe('Name is required');
      }
    });

    it('should fail when name is empty', () => {
      const result = userSchema.safeParse({ name: '', email: 'john@example.com', age: 30 });
      expect(result.success).toBe(false);
    });
  });

  describe('Email validation', () => {
    it('should fail when email is missing', () => {
      const result = userSchema.safeParse({ name: 'John Doe', age: 30 });
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find(issue => issue.path[0] === 'email');
        expect(emailError?.message).toBe('Email is required');
      }
    });

    it('should fail when email format is invalid', () => {
      const result = userSchema.safeParse({ name: 'John Doe', email: 'not-an-email', age: 30 });
      expect(result.success).toBe(false);
      if (!result.success) {
        const emailError = result.error.issues.find(issue => issue.path[0] === 'email');
        expect(emailError?.message).toBe('Invalid email format');
      }
    });
  });

  describe('Age validation', () => {
    it('should fail when age is missing', () => {
      const result = userSchema.safeParse({ name: 'John Doe', email: 'john@example.com' });
      expect(result.success).toBe(false);
      if (!result.success) {
        const ageError = result.error.issues.find(issue => issue.path[0] === 'age');
        expect(ageError?.message).toBe('Age is required');
      }
    });

    it('should fail when age is not a number', () => {
      const result = userSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        age: 'thirty',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const ageError = result.error.issues.find(issue => issue.path[0] === 'age');
        expect(ageError?.message).toBe('Age must be a number');
      }
    });

    it('should fail when age is zero or negative', () => {
      const result = userSchema.safeParse({ name: 'John Doe', email: 'john@example.com', age: 0 });
      expect(result.success).toBe(false);
    });
  });
});
