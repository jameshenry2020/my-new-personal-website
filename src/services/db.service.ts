import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

// --- BLOG SERVICES ---

interface GetPostsParams {
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  page?: number;
  limit?: number;
  onlyPublished?: boolean;
}

export async function getPosts({
  categorySlug,
  tagSlug,
  search,
  page = 1,
  limit = 10,
  onlyPublished = true,
}: GetPostsParams) {
  const skip = (page - 1) * limit;

  const where: Prisma.PostWhereInput = {};

  if (onlyPublished) {
    where.published = true;
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (tagSlug) {
    where.tags = { some: { slug: tagSlug } };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    db.post.findMany({
      where,
      include: {
        category: {
          select: { name: true, slug: true },
        },
        tags: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.post.count({ where }),
  ]);

  return {
    posts,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
  };
}

export async function getPostBySlug(slug: string) {
  return db.post.findUnique({
    where: { slug },
    include: {
      category: {
        select: { name: true, slug: true },
      },
      tags: {
        select: { name: true, slug: true },
      },
    },
  });
}

export async function getCategories() {
  return db.category.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getTags() {
  return db.tag.findMany({
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getRelatedPosts(postId: string, categoryId: string, limit = 3) {
  return db.post.findMany({
    where: {
      categoryId,
      id: { not: postId },
      published: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      category: { select: { name: true, slug: true } },
    },
  });
}

// --- PROJECT SERVICES ---

interface GetProjectsParams {
  featured?: boolean;
  search?: string;
}

export async function getProjects({ featured, search }: GetProjectsParams = {}) {
  const where: Prisma.ProjectWhereInput = {};

  if (featured !== undefined) {
    where.featured = featured;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  return db.project.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(id: string) {
  return db.project.findUnique({
    where: { id },
  });
}

// --- COURSE SERVICES ---

export async function getCourses() {
  return db.course.findMany({
    orderBy: { createdAt: "desc" },
  });
}

// --- BOOK SERVICES ---

export async function getBooks() {
  return db.book.findMany({
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// --- CONTACT SERVICES ---

export async function saveContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return db.contactMessage.create({
    data,
  });
}

export async function getContactMessages() {
  return db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function markMessageRead(id: string, read = true) {
  return db.contactMessage.update({
    where: { id },
    data: { read },
  });
}

export async function deleteMessage(id: string) {
  return db.contactMessage.delete({
    where: { id },
  });
}
