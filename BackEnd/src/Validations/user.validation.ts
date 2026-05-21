import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address format"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address format"),
    password: z.string().min(1, "Password is required")
});
