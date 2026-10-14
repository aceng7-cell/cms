
import { unstable_cache } from "next/cache";
import prisma from "./prisma";

const PAGE_SIZE = 15;
const PAGE_GENRES_SIZE = 20;

async function fetchGenres(slug: string, page: number) {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_SIZE;

  const [genres, total] = await Promise.all([
    prisma.genre.findUnique({
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
            genres: {
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
        genres: {
          some: {
            slug,
          },
        },
      },
    }),
  ]);

  return {
    genres,
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage,
  };
}

export const getGenres = (slug: string, page = 1) =>
  unstable_cache(
    async () => {
      return fetchGenres(slug, page);
    },
    ["genres", slug, String(page)],
    {
      tags: ["genres", `genres:${slug}`],
      revalidate: 7200,
    },
  )();

const fetchAllGenres = async (page: number) => {
  const currentPage = Math.max(1, page);
  const skip = (currentPage - 1) * PAGE_GENRES_SIZE;

  const [genres, total] = await Promise.all([
    prisma.genre.findMany({
      orderBy: {
        name: "asc",
      },
      skip,
      take: PAGE_GENRES_SIZE,
      select: {
        name: true,
        slug: true,
        articles: {
          orderBy: {
            createdAt: "desc",
          },
          take: PAGE_SIZE,
          include: {
            genres: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    }),

    prisma.genre.count(),
  ]);

  return {
    genres,
    total,
    totalPages: Math.ceil(total / PAGE_GENRES_SIZE),
    currentPage,
  };
};

export const getAllGenres = (page = 1) =>
  unstable_cache(
    async () => {
      return fetchAllGenres(page);
    },
    ["genres", "all", String(Math.max(1, page))],
    {
      tags: ["genres"],
      revalidate: 7200,
    },
  )();
