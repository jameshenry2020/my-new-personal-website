"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { postSchema, projectSchema, courseSchema, bookSchema } from "@/validators";
import { revalidatePath } from "next/cache";

// Helper to verify admin authentication
async function verifyAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: string }).role !== "admin") {
    throw new Error("Unauthorized access. Admin privileges required.");
  }
}

// --- BLOG POST ACTIONS ---

export async function createPost(data: unknown) {
  await verifyAdmin();
  
  const validation = postSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  const { title, slug, content, coverImage, published, categoryId, tags } = validation.data;

  try {
    const post = await db.post.create({
      data: {
        title,
        slug,
        content,
        coverImage: coverImage || null,
        published,
        categoryId,
        tags: {
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]/g, "-") },
          })),
        },
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    const err = error as { code?: string };
    if (err.code === "P2002") {
      return { success: false, message: "A post with this slug already exists." };
    }
    return { success: false, message: "Failed to create post. Database error." };
  }
}

export async function updatePost(id: string, data: unknown) {
  await verifyAdmin();

  const validation = postSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  const { title, slug, content, coverImage, published, categoryId, tags } = validation.data;

  try {
    // We disconnect all tags and reconnect the new set
    const post = await db.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        coverImage: coverImage || null,
        published,
        categoryId,
        tags: {
          set: [], // Clear relations
          connectOrCreate: tags.map((tagName) => ({
            where: { name: tagName },
            create: { name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]/g, "-") },
          })),
        },
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin");
    return { success: true, post };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, message: "Failed to update post." };
  }
}

export async function deletePost(id: string) {
  await verifyAdmin();
  try {
    const post = await db.post.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath("/admin");
    return { success: true, post };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, message: "Failed to delete post." };
  }
}

// --- PROJECT ACTIONS ---

export async function createProject(data: unknown) {
  await verifyAdmin();

  const validation = projectSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  try {
    const project = await db.project.create({
      data: {
        ...validation.data,
        content: validation.data.content || null,
        coverImage: validation.data.coverImage || null,
      },
    });
    revalidatePath("/projects");
    revalidatePath("/admin");
    return { success: true, project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, message: "Failed to create project." };
  }
}

export async function updateProject(id: string, data: unknown) {
  await verifyAdmin();

  const validation = projectSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  try {
    const project = await db.project.update({
      where: { id },
      data: {
        ...validation.data,
        content: validation.data.content || null,
        coverImage: validation.data.coverImage || null,
      },
    });
    revalidatePath("/projects");
    revalidatePath("/admin");
    return { success: true, project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, message: "Failed to update project." };
  }
}

export async function deleteProject(id: string) {
  await verifyAdmin();
  try {
    const project = await db.project.delete({ where: { id } });
    revalidatePath("/projects");
    revalidatePath("/admin");
    return { success: true, project };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, message: "Failed to delete project." };
  }
}

// --- COURSE ACTIONS ---

export async function createCourse(data: unknown) {
  await verifyAdmin();

  const validation = courseSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  try {
    const course = await db.course.create({
      data: {
        ...validation.data,
        thumbnail: validation.data.thumbnail || null,
      },
    });
    revalidatePath("/courses");
    revalidatePath("/admin");
    return { success: true, course };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, message: "Failed to create course." };
  }
}

export async function updateCourse(id: string, data: unknown) {
  await verifyAdmin();

  const validation = courseSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  try {
    const course = await db.course.update({
      where: { id },
      data: {
        ...validation.data,
        thumbnail: validation.data.thumbnail || null,
      },
    });
    revalidatePath("/courses");
    revalidatePath("/admin");
    return { success: true, course };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, message: "Failed to update course." };
  }
}

export async function deleteCourse(id: string) {
  await verifyAdmin();
  try {
    const course = await db.course.delete({ where: { id } });
    revalidatePath("/courses");
    revalidatePath("/admin");
    return { success: true, course };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, message: "Failed to delete course." };
  }
}

// --- BOOK ACTIONS ---

export async function createBook(data: unknown) {
  await verifyAdmin();

  const validation = bookSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  try {
    const book = await db.book.create({
      data: {
        ...validation.data,
        coverImage: validation.data.coverImage || null,
      },
    });
    revalidatePath("/books");
    revalidatePath("/admin");
    return { success: true, book };
  } catch (error) {
    console.error("Error creating book:", error);
    return { success: false, message: "Failed to create book." };
  }
}

export async function updateBook(id: string, data: unknown) {
  await verifyAdmin();

  const validation = bookSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors };
  }

  try {
    const book = await db.book.update({
      where: { id },
      data: {
        ...validation.data,
        coverImage: validation.data.coverImage || null,
      },
    });
    revalidatePath("/books");
    revalidatePath("/admin");
    return { success: true, book };
  } catch (error) {
    console.error("Error updating book:", error);
    return { success: false, message: "Failed to update book." };
  }
}

export async function deleteBook(id: string) {
  await verifyAdmin();
  try {
    const book = await db.book.delete({ where: { id } });
    revalidatePath("/books");
    revalidatePath("/admin");
    return { success: true, book };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { success: false, message: "Failed to delete book." };
  }
}

// --- CONTACT MESSAGE ACTIONS ---

export async function deleteContactMessage(id: string) {
  await verifyAdmin();
  try {
    await db.contactMessage.delete({ where: { id } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, message: "Failed to delete message." };
  }
}

export async function markContactMessageRead(id: string, read = true) {
  await verifyAdmin();
  try {
    await db.contactMessage.update({ where: { id }, data: { read } });
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error marking message read:", error);
    return { success: false, message: "Failed to update message." };
  }
}
