import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'Name is required.', invalid_type_error: 'Name is required.' })
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must not exceed 100 characters.'),

  email: z
    .string({ required_error: 'Email is required.', invalid_type_error: 'Email is required.' })
    .trim()
    .toLowerCase()
    .email('Email must be a valid email address.'),

  age: z
    .number({
      required_error: 'Age is required and must be a number.',
      invalid_type_error: 'Age is required and must be a number.',
    })
    .int('Age must be an integer.')
    .min(1, 'Age must be at least 1.')
    .max(120, 'Age must not exceed 120.'),
});

export const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters.')
      .max(100, 'Name must not exceed 100 characters.')
      .optional(),

    email: z.string().trim().toLowerCase().email('Email must be a valid email address.').optional(),

    age: z
      .number({ invalid_type_error: 'Age must be a number.' })
      .int('Age must be an integer.')
      .min(1, 'Age must be at least 1.')
      .max(120, 'Age must not exceed 120.')
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for an update.' },
  );

export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
