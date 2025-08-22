import { email, z } from "zod";

export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string(),
    photo: z.string().optional()
})

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export const createRoomSchema = z.object({
    name: z.string().min(3).max(20)
})