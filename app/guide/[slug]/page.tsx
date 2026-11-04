import Link from "next/link";
import { guides } from "@/lib/guides";
import GuideView from "@/components/GuideView";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p>Guide not found.</p>
        <Link href="/" className="text-blue-600 underline">
          Back home
        </Link>
      </div>
    );
  }

  return <GuideView guide={guide} />;
}