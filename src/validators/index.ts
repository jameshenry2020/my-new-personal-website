import { z } from "zod";

// Environment validation schema
export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(8),
  NEXTAUTH_URL: z.string().url().default("http://localhost:3000"),
  ADMIN_EMAIL: z.string().email().default("admin@henrydev.online"),
  ADMIN_PASSWORD: z.string().min(8).default("HenrySecurePassword123!"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

// Blog Post schema
export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  categoryId: z.string().uuid("Please select a valid category"),
  tags: z.array(z.string()).default([]),
});

// Project schema
export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().optional().or(z.literal("")),
  technologies: z.array(z.string()).min(1, "Please add at least one technology"),
  githubUrl: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
  screenshots: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  projectType: z.enum(["BACKEND_ONLY", "FULL_STACK", "MOBILE"]).default("FULL_STACK"),
});

// Course schema
export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnail: z.string().url().optional().or(z.literal("")),
  playlistUrl: z.string().url("Must be a valid YouTube playlist URL"),
});

// Book schema
export const bookSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  coverImage: z.string().url().optional().or(z.literal("")),
  purchaseUrl: z.string().url("Must be a valid purchase URL"),
});

// Contact Message schema
export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
