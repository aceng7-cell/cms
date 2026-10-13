"use client";

import { useState, useRef } from "react";
import { ServerButtons } from "./server";
import PlayerNotice from "./player-notice";
import type { Prisma } from "@/generated/prisma/client";
import { Posts } from "../[...slug]/page";

import {
  AlertCircleIcon,
  Calendar,
  Download,
  ExternalLink,
  Maximize2,
  TextIcon,
  UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import { AdsSectionProps } from "../../../../lib/ads";
import Link from "next/link";
import Iframe from "./iframe";
import Image from "next/image";
import DownloadBtn from "./download";

export type PlayerSite = Prisma.SiteSettingGetPayload<{
  select: {
    playerNoticeTitle: true;
    playerNoticeDescription: true;
    telegramTitle: true;
    telegramDescription: true;
    socialLinks: true;
  };
}>;

export default function Player({
  posts,
  site,
  ads,
}: {
  posts: Posts;
  site: PlayerSite;
  ads: AdsSectionProps[];
}) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [activeServer, setActiveServer] = useState(
    posts.iframe[0]?.title ?? "",
  );

  const activeStream = posts.iframe.find(
    (stream) => stream.title === activeServer,
  );

  const createdAt = new Date(posts.createdAt);

  return (
    <section className="mb-8 w-full max-w-4xl px-4 py-4 ">
      <div className="mb-5 space-y-3">
        <h2 className="flex items-start gap-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          <TextIcon className="mt-0.5 size-6 shrink-0 text-primary" />
          <span>{posts.title}</span>
        </h2>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <time dateTime={createdAt.toISOString()}>
              {format(createdAt, "dd MMM yyyy", {
                locale: id,
              })}
            </time>
          </div>

          <div className="flex items-center gap-1.5">
            <UserIcon className="size-4" />
            <span>{posts.uploadBy}</span>
          </div>
        </div>
      </div>
      {posts.thumbnail && (
        <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
          <Image
            src={posts.thumbnail}
            alt={posts.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
            loading="eager"
          />
        </div>
      )}

      <div
        ref={playerRef}
        className="relative isolate aspect-video w-full overflow-hidden rounded-xl border border-border bg-black shadow-sm"
      >
        {activeStream?.isActive ? (
          <>
            <div className="absolute inset-0 h-full w-full [&>*]:!h-full [&>*]:!w-full [&_iframe]:!absolute [&_iframe]:!inset-0 [&_iframe]:!h-full [&_iframe]:!w-full [&_iframe]:!max-w-none">
              <Iframe src={activeStream.src} />
            </div>

            <button
              type="button"
              aria-label="Fullscreen"
              onClick={() => {
                if (document.fullscreenElement) {
                  void document.exitFullscreen();
                } else {
                  void playerRef.current?.requestFullscreen();
                }
              }}
              className="absolute bottom-3 right-3 z-50 rounded-lg bg-black/70 p-2 text-white transition hover:bg-black/90"
            >
              <Maximize2 className="size-5" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-neutral-400">
            <AlertCircleIcon className="size-8" />
            <span>Stream unavailable</span>
          </div>
        )}
      </div>
      <div className="mt-5">
        <PlayerNotice site={site} />
      </div>
      <div className="mt-5 rounded-xl border border-border bg-card p-3 sm:p-4">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Pilih Server
        </p>

        <ServerButtons
          servers={posts.iframe}
          activeServer={activeServer}
          onServerChange={setActiveServer}
          ads={ads}
        />
      </div>
      {posts.content && (
        <div
          className="
            prose prose-sm mt-7 max-w-none
            prose-headings:font-bold
            prose-headings:tracking-tight
            prose-a:text-primary
            prose-img:rounded-lg
            dark:prose-invert
            sm:prose-base
          "
          dangerouslySetInnerHTML={{
            __html: posts.content,
          }}
        />
      )}

      <div className="mt-6 border-t border-border pt-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Download className="size-4 text-primary" />
          Download Links
        </p>

        <DownloadBtn posts={posts} ads={ads} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 border-t border-border pt-5 md:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Genres</p>

          {posts.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {posts.genres.map((genre) => (
                <Link
                  key={genre.slug}
                  href={`/genres/${genre.slug}`}
                  className="
              inline-flex items-center rounded-full
              border border-border bg-muted/50
              px-3 py-1.5 text-xs font-medium
              text-muted-foreground
              transition-colors
              hover:border-primary/40
              hover:bg-primary/10
              hover:text-primary
            "
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-foreground">Category</p>

          {posts.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {posts.categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="
              inline-flex items-center rounded-full
              border border-border bg-muted/50
              px-3 py-1.5 text-xs font-medium
              text-muted-foreground
              transition-colors
              hover:border-primary/40
              hover:bg-primary/10
              hover:text-primary
            "
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
