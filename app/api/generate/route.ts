import { NextResponse } from "next/server";
import { generateGuide } from "@/lib/agent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const guide = await generateGuide(query);

    return NextResponse.json({ guide });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}