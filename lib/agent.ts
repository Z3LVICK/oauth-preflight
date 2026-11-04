import { Guide, Source, Step } from "./type";

type SearchResult = {
  title: string;
  url: string;
  snippet: string;
};

export async function generateGuide(query: string): Promise<Guide> {
  const appName = normalizeAppName(query);
  const slug = slugify(appName);
  const generatedAt = new Date().toISOString();

  const hasSearch = Boolean(process.env.TAVILY_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY);

  let evidence: SearchResult[] = [];

  if (hasSearch) {
    try {
      evidence = await searchWeb(
        `${appName} OAuth app setup developer portal approval requirements`
      );
    } catch {
      evidence = [];
    }
  }

  // If no Gemini key, return a useful fallback guide instead of failing.
  if (!hasGemini) {
    return makeFallbackGuide(appName, slug, generatedAt, evidence);
  }

  try {
    const evidenceText =
      evidence
        .map(
          (r) =>
            `Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.snippet}`
        )
        .join("\n\n") || "No external evidence available.";

    const systemPrompt = `
You are an OAuth integration research agent.

Your job is to help developers understand how to create an OAuth app for a provider and get it approved.

Rules:
- Use the evidence if available.
- If unsure, say uncertain.
- Do not invent approval times.
- Do not invent requirements.
- Return ONLY valid JSON.
- No markdown.
- No explanations outside JSON.

Use this exact JSON shape:
{
  "appName": string,
  "website": string,
  "developerPortal": string,
  "summary": string,
  "difficulty": "Very easy" | "Easy" | "Moderate" | "Hard" | "Very hard",
  "timeToFirstWorkingSetup": string,
  "approvalWait": string,
  "approvalRequired": boolean,
  "approvalSummary": string,
  "requirements": string[],
  "blockers": string[],
  "steps": [
    {
      "title": string,
      "detail": string,
      "owner": "agent" | "human" | "both",
      "time": string
    }
  ],
  "agentCanDo": string[],
  "humanMustDo": string[],
  "sources": [
    {
      "url": string,
      "title": string,
      "type": string
    }
  ],
  "uncertainties": string[],
  "tested": string[],
  "notTested": string[],
  "confidence": "high" | "medium" | "low"
}
`.trim();

    const userPrompt = `
App to investigate: ${appName}

Evidence:
${evidenceText}

Generate the guide now.
`.trim();

    const raw = await callGemini(systemPrompt, userPrompt);

    return normalizeGeneratedGuide(raw, appName, slug, generatedAt, evidence);
  } catch {
    return makeFallbackGuide(appName, slug, generatedAt, evidence);
  }
}

function normalizeAppName(query: string) {
  const cleaned = query.trim().replace(/^https?:\/\//, "");
  const domain = cleaned.split("/")[0];
  const base = domain.includes(".")
    ? domain.split(".")[0]
    : domain;

  return base.charAt(0).toUpperCase() + base.slice(1);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function searchWeb(query: string): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: 5,
    }),
  });

  if (!res.ok) return [];

  const data = await res.json() as { results?: unknown[] };

  const results = Array.isArray(data?.results) ? data.results : [];
  return results.map((r) => {
    const item = r as Record<string, unknown>;
    return {
      title: typeof item.title === "string" ? item.title : "Untitled",
      url: typeof item.url === "string" ? item.url : "",
      snippet:
        typeof item.content === "string"
          ? item.content
          : typeof item.description === "string"
            ? item.description
            : "",
    };
  });
}

async function callGemini(system: string, user: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing Gemini key");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: system }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: user }],
          },
        ],
        generation_config: {
          temperature: 0.2,
          response_mime_type: "application/json",
        },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini error: ${text}`);
  }

  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error("No content from Gemini");
  }

  return JSON.parse(content);
}

function normalizeGeneratedGuide(
  raw: unknown,
  appName: string,
  slug: string,
  generatedAt: string,
  evidence: SearchResult[]
): Guide {
  const data = raw as Partial<Guide>;
  const difficultyOptions = [
    "Very easy",
    "Easy",
    "Moderate",
    "Hard",
    "Very hard",
  ];

  const confidenceOptions = ["high", "medium", "low"];

  const difficulty =
    typeof data.difficulty === "string" &&
    difficultyOptions.includes(data.difficulty)
      ? data.difficulty
      : "Moderate";

  const confidence =
    typeof data.confidence === "string" &&
    confidenceOptions.includes(data.confidence)
      ? data.confidence
      : "low";

  return {
    slug: slug,
    appName: typeof data.appName === "string" ? data.appName : appName,
    website: typeof data.website === "string" ? data.website : undefined,
    developerPortal: typeof data.developerPortal === "string"
      ? data.developerPortal
      : undefined,
    summary:
      typeof data.summary === "string"
        ? data.summary
        : `Generated a preliminary guide for ${appName} based on limited evidence.`,
    difficulty,
    timeToFirstWorkingSetup:
      typeof data.timeToFirstWorkingSetup === "string"
        ? data.timeToFirstWorkingSetup
        : "Unknown",
    approvalWait: typeof data.approvalWait === "string"
      ? data.approvalWait
      : "Unknown",
    approvalRequired: Boolean(data.approvalRequired),
    approvalSummary:
      typeof data.approvalSummary === "string"
        ? data.approvalSummary
        : "Approval requirements could not be fully verified.",
    requirements: toStringArray(data.requirements),
    blockers: toStringArray(data.blockers),
    steps: toSteps(data.steps),
    agentCanDo: toStringArray(data.agentCanDo),
    humanMustDo: toStringArray(data.humanMustDo),
    sources: toSources(data.sources, evidence),
    uncertainties: toStringArray(data.uncertainties),
    tested: toStringArray(data.tested),
    notTested: toStringArray(data.notTested),
    confidence,
    generatedBy: "agent",
    generatedAt,
  };
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => typeof item === "string");
}

function toSteps(value: unknown): Step[] {
  if (!Array.isArray(value)) {
    return [
      {
        title: "Find the developer portal",
        detail:
          "Search for the provider's official developer or API documentation.",
        owner: "both",
      },
      {
        title: "Create an app registration",
        detail:
          "Look for OAuth app creation, API credentials, or app integration settings.",
        owner: "human",
      },
      {
        title: "Configure redirect and scopes",
        detail:
          "Set redirect URI and request only the permissions needed.",
        owner: "human",
      },
    ];
  }

  return value
    .map((step) => {
      const s = step as Record<string, unknown>;
      return {
        title: typeof s.title === "string" ? s.title : "Untitled step",
        detail: typeof s.detail === "string" ? s.detail : "",
        owner:
          typeof s.owner === "string" &&
          ["agent", "human", "both"].includes(s.owner)
            ? (s.owner as "agent" | "human" | "both")
            : "both",
        time: typeof s.time === "string" ? s.time : undefined,
      };
    })
    .filter((step) => Boolean(step.title));
}

function toSources(value: unknown, evidence: SearchResult[]): Source[] {
  if (Array.isArray(value) && value.length > 0) {
    return value
      .map((s) => {
        const src = s as Record<string, unknown>;
        return {
          url: (src.url as string) || "",
          title: (src.title as string) || "Source",
          type: (src.type as string) || "other",
        };
      })
      .filter((s) => Boolean(s.url));
  }

  return evidence.map((r) => ({
    url: r.url,
    title: r.title,
    type: "search_result",
  }));
}

function makeFallbackGuide(
  appName: string,
  slug: string,
  generatedAt: string,
  evidence: SearchResult[]
): Guide {
  const summary = evidence.length
    ? `Found some possible sources for ${appName}, but live generation is limited. Review the sources carefully before relying on this guide.`
    : `No live research configuration found for ${appName}. Add API keys to enable real agent generation.`;

  return {
    slug,
    appName,
    website: undefined,
    developerPortal: undefined,
    summary,
    difficulty: "Moderate",
    timeToFirstWorkingSetup: "Unknown",
    approvalWait: "Unknown",
    approvalRequired: false,
    approvalSummary:
      "Approval requirements could not be verified without live research.",
    requirements: [
      "Developer account",
      "App name",
      "Redirect URI",
      "Requested scopes",
    ],
    blockers: [
      "Missing official documentation",
      "Unknown approval requirements",
      "Unclear scope model",
    ],
    steps: [
      {
        title: "Find official developer docs",
        detail: `Search for ${appName} developer documentation or API docs.`,
        owner: "both",
        time: "30 minutes",
      },
      {
        title: "Create an OAuth app",
        detail:
          "Look in the provider dashboard for OAuth apps, integrations, or API credentials.",
        owner: "human",
        time: "30 minutes",
      },
      {
        title: "Configure redirect URI and scopes",
        detail:
          "Set the callback URL and choose only the permissions required.",
        owner: "human",
        time: "30 minutes",
      },
      {
        title: "Check approval requirements",
        detail:
          "Look for app review, verification, security review, or listing requirements.",
        owner: "human",
        time: "Unknown",
      },
    ],
    agentCanDo: [
      "Search for documentation",
      "Summarize likely setup steps",
      "Identify likely blockers",
      "Draft a shareable guide",
    ],
    humanMustDo: [
      "Create provider account",
      "Register the app",
      "Configure secrets",
      "Submit review if required",
    ],
    sources: evidence.map((r) => ({
      url: r.url,
      title: r.title,
      type: "search_result",
    })),
    uncertainties: [
      "Official developer portal could not be fully verified",
      "Approval process is unknown",
      "Scopes and redirect requirements are unknown",
    ],
    tested: [],
    notTested: ["No live setup attempt was made"],
    confidence: "low",
    generatedBy: "agent",
    generatedAt,
  };
}