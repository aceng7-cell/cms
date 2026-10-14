import { unstable_cache } from "next/cache";
import prisma from "./prisma";

const PAGE_SIZE = 15;
const PAGE_CATEGORIES_SIZE = 50;

async function fetchCategory(slug: string, page: number) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [category, total] = await Promise.all([
    prisma.category.findUnique({
      where: {
        slug,
      },
      select: {
        name: true,
        slug: true,
        articles: {
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: PAGE_SIZE,
          include: {
            categories: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),

    prisma.article.count({
      where: {
        categories: {
          some: {
            slug,
          },
        },
      },
    }),
  ]);

  return {
    category,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage,
  };
}

export const getCategory = (slug: string, page = 1) =>
  unstable_cache(
    async () => fetchCategory(slug, page),
    ["category", slug, String(Math.max(1, page))],
    {
      tags: ["categories", `category:${slug}`],
      revalidate: 7200,
    },
  )();

const fetchAllCategory = async (page: number) => {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_CATEGORIES_SIZE;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      skip,
      take: PAGE_CATEGORIES_SIZE,
      select: {
        name: true,
        slug: true,
      },
    }),

    prisma.category.count(),
  ]);

  return {
    categories,
    total,
    totalPages: Math.ceil(total / PAGE_CATEGORIES_SIZE),
    currentPage,
  };
};

export const getAllCategory = (page = 1) =>
  unstable_cache(
    async () => fetchAllCategory(page),
    ["categories", String(Math.max(1, page))],
    {
      tags: ["categories"],
      revalidate: 7200,
    },
  )();
