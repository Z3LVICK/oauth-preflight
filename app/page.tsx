import Link from "next/link";
import { guides } from "@/lib/guides";
import SubmitForm from "@/components/SubmitForm";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-10">
      <section className="space-y-3">
        <h1 className="text-4xl font-bold">OAuth Pre-Flight</h1>
        <p className="text-gray-600">
          Understand how hard it is to create and approve an OAuth app before
          you start building.
        </p>
      </section>

      <section className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-2">
          Investigate an app
        </h2>
        <SubmitForm />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Sample guides</h2>
        <div className="grid grid-cols-1 gap-4">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="border rounded-lg p-4 block hover:bg-gray-50"
            >
              <div className="font-bold text-lg">{guide.appName}</div>
              <p className="text-gray-600 mt-1">{guide.summary}</p>
              <div className="mt-2 text-sm text-gray-500">
                {guide.difficulty} •{" "}
                {guide.approvalRequired
                  ? "Approval may be required"
                  : "No known approval"}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}