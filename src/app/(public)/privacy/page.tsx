
import { notFound } from "next/navigation";
import { getPage } from "../../../../lib/page";

export default async function PrivacyPage() {
  const page = await getPage("privacy");

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <header className="border-b border-gray-100 px-6 py-8 sm:px-10 sm:py-10">
          <span className="mb-4 inline-block text-sm font-semibold tracking-widest text-gray-500 uppercase">
            Privacy Policy
          </span>

          <h1 className="text-2xl leading-tight font-bold tracking-tight text-gray-900 sm:text-4xl">
            {page.title}
          </h1>
        </header>

        <article
          className="
            prose prose-lg max-w-none
            px-6 py-8 sm:px-10 sm:py-10
            prose-headings:font-semibold
            prose-headings:tracking-tight
            prose-headings:text-gray-900
            prose-p:leading-8
            prose-p:text-gray-600
            prose-a:font-medium
            prose-a:text-blue-600
            prose-a:no-underline
            hover:prose-a:underline
            prose-strong:font-semibold
            prose-strong:text-gray-900
            prose-ul:text-gray-600
            prose-ol:text-gray-600
            prose-li:marker:text-gray-400
            prose-blockquote:border-l-gray-300
            prose-blockquote:text-gray-600
            prose-img:rounded-xl
          "
          dangerouslySetInnerHTML={{
            __html: page.content,
          }}
        />
      </div>
    </main>
  );
}
