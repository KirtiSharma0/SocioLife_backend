import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be at most 50 characters long" }),

  email: z
    .string()
    .email({ message: "Invalid email address" }),

  age: z
    .number({ invalid_type_error: "Age must be a number" })
    .int({ message: "Age must be an integer" })
    .min(13, { message: "You must be at least 13 years old" })
    .max(120, { message: "Please enter a valid age" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),

  confirmPassword: z
    .string()
    .min(6, { message: "Confirm password must be at least 6 characters long" }),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" })
    .optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});