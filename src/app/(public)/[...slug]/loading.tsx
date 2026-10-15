import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <main className="max-w-4xl  px-6 py-8 sm:py-10">
      <Skeleton className="h-96  w-full rounded-xl bg-muted" />
    </main>
  );
};

export default Loading;
