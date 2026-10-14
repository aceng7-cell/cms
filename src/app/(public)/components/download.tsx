import { Posts } from "../[...slug]/page";
import { Download, ExternalLink } from "lucide-react";
import { AdsSectionProps } from "../../../../lib/ads";
import Link from "next/link";

const DownloadBtn = ({
  posts,
  ads,
}: {
  posts: Posts;
  ads: AdsSectionProps[];
}) => {
  return (
    <div>
      {posts.download.length > 0 && (
        <div className="space-y-4">
          {posts.download.map((download, index) => (
            <div key={`${download.quality}-${index}`} className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                {download.quality}
              </p>

              <div className="flex flex-wrap gap-2">
                {download.links.map((link, linkIndex) => (
                  <Link
                    href={link.url}
                    key={`${link.id}-${linkIndex}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      const popunder = ads.find(
                        (ad) => ad.position === "popunder",
                      );

                      if (popunder) {
                        window.open(
                          popunder.url,
                          "_blank",
                          "noopener,noreferrer",
                        );
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-black/80 hover:bg-black/90 hover:text-white"
                  >
                    <Download className="size-3.5" />
                    {link.name}
                    <ExternalLink className="size-3 opacity-60" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadBtn;
