export type Step = {
    title: string;
    detail: string;
    owner: "agent" | "human" | "both";
    time?: string;
};

export type Source = {
    url: string;
    title: string;
    type: string;
};

export type Guide = {
    slug: string;
    appName: string;
    website?: string;
    developerPortal?: string;
    summary: string;
    difficulty: "Very easy" | "Easy" | "Moderate" | "Hard" | "Very hard";
    timeToFirstWorkingSetup: string;
    approvalWait: string;
    approvalRequired: boolean;
    approvalSummary: string;
    requirements: string[];
    blockers: string[];
    steps: Step[];
    agentCanDo: string[];
    humanMustDo: string[];
    sources: Source[];
    uncertainties: string[];
    tested: string[];
    notTested: string[];
    confidence: "high" | "medium" | "low";
    generatedBy: "seeded" | "agent";
    generatedAt: string;
};
