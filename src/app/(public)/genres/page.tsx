import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getSiteSeo } from "../../../../lib/site";
import { ArrowLeft, ArrowRight, List } from "lucide-react";
import { getAllGenres } from "../../../../lib/genres";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSeo();

  const title = `Genres - ${site.siteName}`;

  const description =
    `Browse all Genres on ${site.siteName}. ` + `Find content by genres.`;

  const canonical = `${site.siteUrl}/genres`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: site.siteName,
      images: site.ogImage
        ? [
            {
              url: site.ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: site.ogImage ? [site.ogImage] : undefined,
    },
  };
}

type GenresPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function GenresPage({ searchParams }: GenresPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const { genres, currentPage, totalPages } = await getAllGenres(page);

  if (genres.length === 0) {
    notFound();
  }

  return (
    <div className="w-full  bg-white">
      <main className=" px-4 py-2">
        <section className="mb-10 px-2 py-1 sm:mb-24 sm:py-2">
          <div className="mx-auto w-full">
            <div className="min-w-0 max-w-full rounded-lg border bg-white px-3 py-2 text-sm text-muted-foreground">
              <div className="mb-0 flex items-center gap-2 text-sm  text-muted-foreground">
                <List className="size-4" />
                <span>Genre List</span>
              </div>
            </div>

            <div className="max-w-2xl">
              {genres.length > 0 ? (
                <div className="mt-4 mb-4 flex min-h-8 flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Link key={genre.slug} href={`/genres/${genre.slug}`}>
                      <span className="flex min-w-0 max-w-full items-center gap-2 rounded-lg border bg-black px-3 py-2 text-sm text-white">
                        {genre.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="border-4 border-black bg-white p-10 text-center font-black shadow-[7px_7px_0_#000]">
                  There are no genres yet.
                </div>
              )}

              {totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-10 flex flex-wrap items-center justify-center gap-2"
                >
                  {currentPage > 1 && (
                    <Link
                      href={`/genres?page=${currentPage - 1}`}
                      aria-label="Previous page"
                      className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Previous</span>
                    </Link>
                  )}

                  <span className="inline-flex h-10 items-center rounded-lg border bg-muted/50 px-4 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>

                  {currentPage < totalPages && (
                    <Link
                      href={`/genres?page=${currentPage + 1}`}
                      aria-label="Next page"
                      className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      <span>Next</span>
                      <ArrowRight className="size-4" />
                    </Link>
                  )}
                </nav>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
