import { z } from 'zod';

export const userSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1, { message: 'Name must not be empty' }),
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  age: z.number({
    required_error: 'Age is required',
    invalid_type_error: 'Age must be a number',
  }).positive({ message: 'Age must be a positive number' }),
});

export type UserType = z.infer<typeof userSchema>;
