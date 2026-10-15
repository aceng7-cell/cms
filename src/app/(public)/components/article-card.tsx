import { Calendar, PlayIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type ArticleCardProps = {
  article: {
    id: string;
    title: string;
    thumbnail: string | null;
    slug: string;
    metaDescription: string | null;
    createdAt: Date;
    uploadBy: string;
  };
};

export function ArticleCard({ article }: ArticleCardProps) {
  const createdAt = new Date(article.createdAt);
  const articleUrl = `/${format(createdAt, "yyyy/MM/dd")}/${article.slug}`;
  console.log(article.thumbnail);
  return (
    <article className="group h-full">
      <Link
        href={articleUrl}
        className="relative block h-full min-h-[220px] overflow-hidden rounded-xl bg-muted sm:min-h-[280px]"
      >
        {article.thumbnail && (
          <img
            src={article.thumbnail}
            alt={"kontol"}
            className="absolute inset-0 z-0 block h-full w-full object-cover"
            loading="lazy"
          />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 transition-colors duration-300 group-hover:from-black/90" />

        {/* Title and date */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h2 className="mb-2 line-clamp-2 text-base font-semibold leading-snug text-white sm:text-md">
            {article.title.length > 40
              ? `${article.title.slice(0, 40)}...`
              : article.title}
          </h2>

          <div className="flex items-center gap-1.5 text-white/75">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <time
              dateTime={createdAt.toISOString()}
              className="text-xs font-medium"
            >
              {format(createdAt, "dd MMM yyyy", { locale: id })}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}