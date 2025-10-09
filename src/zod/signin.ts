import z from "zod";

export const zodLoginSchema = z.object({
    email: z.string().email("invalid email"),
    password: z.string().min(6, "password must be atleast 6 characters long"),
});