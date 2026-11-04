import { Guide } from "./type";

export const guides: Guide[] = [
  {
    slug: "github-oauth",
    appName: "GitHub",
    website: "https://github.com",
    developerPortal: "https://github.com/settings/developers",
    summary:
      "GitHub OAuth Apps are usually easy to create for internal use. No provider approval is normally needed for basic private apps, but scopes and secret handling still matter.",
    difficulty: "Very easy",
    timeToFirstWorkingSetup: "15-30 minutes",
    approvalWait: "None known for private/internal apps",
    approvalRequired: false,
    approvalSummary:
      "GitHub usually does not require approval for a private OAuth app. Public distribution may have extra requirements.",
    requirements: [
      "GitHub account",
      "Application name",
      "Authorization callback URL",
    ],
    blockers: [
      "Missing callback URL",
      "Requesting too many scopes",
      "Insecure handling of client secret",
    ],
    steps: [
      {
        title: "Open GitHub Developer Settings",
        detail: "Go to Settings > Developer settings > OAuth Apps.",
        owner: "human",
        time: "5 minutes",
      },
      {
        title: "Create a new OAuth App",
        detail:
          "Enter application name, homepage URL, and authorization callback URL.",
        owner: "human",
        time: "5 minutes",
      },
      {
        title: "Choose minimum scopes",
        detail:
          "Only request the permissions your integration really needs.",
        owner: "human",
        time: "5 minutes",
      },
      {
        title: "Implement authorization redirect",
        detail:
          "Send users to GitHub's authorize URL with client_id, redirect_uri, scope, and state.",
        owner: "both",
        time: "15 minutes",
      },
    ],
    agentCanDo: [
      "Find official GitHub OAuth docs",
      "Summarize required fields",
      "Suggest likely scopes",
      "Draft setup steps",
    ],
    humanMustDo: [
      "Log in to GitHub",
      "Create the OAuth app",
      "Store client secret securely",
      "Choose final scopes",
    ],
    sources: [
      {
        url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app",
        title: "Creating an OAuth App",
        type: "official_docs",
      },
      {
        url: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps",
        title: "Authorizing OAuth Apps",
        type: "official_docs",
      },
    ],
    uncertainties: [
      "Public distribution requirements were not fully verified in this demo",
    ],
    tested: ["Checked official docs for app creation and callback URL"],
    notTested: ["Did not complete a full production OAuth flow"],
    confidence: "high",
    generatedBy: "seeded",
    generatedAt: "2026-11-04T00:00:00.000Z",
  },

  {
    slug: "slack-oauth",
    appName: "Slack",
    website: "https://slack.com",
    developerPortal: "https://api.slack.com/apps",
    summary:
      "Slack apps are straightforward to create and install into a test workspace, but public distribution can require more review and security scrutiny.",
    difficulty: "Moderate",
    timeToFirstWorkingSetup: "30-60 minutes",
    approvalWait: "None for internal testing; variable for public distribution",
    approvalRequired: true,
    approvalSummary:
      "Installing into your own workspace is easy. Making the app publicly distributable may require review.",
    requirements: [
      "Slack workspace",
      "Redirect URL",
      "Scopes",
      "App manifest or manual app setup",
    ],
    blockers: [
      "Wrong redirect URL",
      "Too many scopes",
      "Public distribution review",
    ],
    steps: [
      {
        title: "Create a Slack app",
        detail: "Use the Slack API dashboard to create a new app.",
        owner: "human",
        time: "10 minutes",
      },
      {
        title: "Add redirect URL",
        detail: "Configure the OAuth redirect URL for your app.",
        owner: "human",
        time: "5 minutes",
      },
      {
        title: "Choose scopes",
        detail:
          "Pick the minimum Bot Token Scopes or User Token Scopes needed.",
        owner: "human",
        time: "10 minutes",
      },
      {
        title: "Install to test workspace",
        detail: "Install the app locally before considering distribution.",
        owner: "human",
        time: "10 minutes",
      },
      {
        title: "Prepare for public distribution if needed",
        detail:
          "If the app is public, review Slack security and distribution requirements.",
        owner: "human",
        time: "1-2 hours",
      },
    ],
    agentCanDo: [
      "Find Slack OAuth docs",
      "Summarize app setup requirements",
      "Identify likely scopes",
      "Explain internal vs public distribution",
    ],
    humanMustDo: [
      "Create Slack app",
      "Configure redirect URL",
      "Approve workspace install",
      "Submit public app review if needed",
    ],
    sources: [
      {
        url: "https://api.slack.com/authentication",
        title: "Slack Authentication",
        type: "official_docs",
      },
      {
        url: "https://api.slack.com/security",
        title: "Slack Security",
        type: "official_docs",
      },
    ],
    uncertainties: [
      "Current public app review timing was not directly tested",
    ],
    tested: ["Checked official Slack documentation"],
    notTested: ["Did not submit a public Slack app for review"],
    confidence: "medium",
    generatedBy: "seeded",
    generatedAt: "2026-11-04T00:00:00.000Z",
  },

  {
    slug: "google-calendar-oauth",
    appName: "Google Calendar",
    website: "https://calendar.google.com",
    developerPortal: "https://console.cloud.google.com",
    summary:
      "Google Calendar OAuth can be powerful but often involves consent screen setup, sensitive scopes, and possibly verification before production use.",
    difficulty: "Hard",
    timeToFirstWorkingSetup: "1-3 hours for testing mode",
    approvalWait: "Days to weeks if verification is required",
    approvalRequired: true,
    approvalSummary:
      "Google requires OAuth consent screen configuration. Sensitive or restricted scopes may require verification for production.",
    requirements: [
      "Google Cloud project",
      "OAuth consent screen",
      "Authorized redirect URI",
      "Scopes",
      "Test users for testing mode",
    ],
    blockers: [
      "Sensitive scope verification",
      "Missing privacy policy",
      "Domain verification issues",
      "Production access restrictions",
    ],
    steps: [
      {
        title: "Create Google Cloud project",
        detail: "Set up a project in Google Cloud Console.",
        owner: "human",
        time: "10 minutes",
      },
      {
        title: "Enable Calendar API",
        detail: "Enable the Google Calendar API for the project.",
        owner: "human",
        time: "10 minutes",
      },
      {
        title: "Configure OAuth consent screen",
        detail:
          "Set app name, support email, authorized domains, and developer contact.",
        owner: "human",
        time: "20 minutes",
      },
      {
        title: "Create OAuth client",
        detail:
          "Create credentials and configure authorized redirect URIs.",
        owner: "human",
        time: "15 minutes",
      },
      {
        title: "Add test users",
        detail:
          "Keep the app in testing mode and add allowed test accounts.",
        owner: "human",
        time: "10 minutes",
      },
      {
        title: "Prepare verification if needed",
        detail:
          "If using sensitive/restricted scopes in production, prepare for Google verification.",
        owner: "human",
        time: "Days to weeks",
      },
    ],
    agentCanDo: [
      "Find Google OAuth documentation",
      "Identify likely sensitive scopes",
      "Explain consent screen setup",
      "Warn about verification requirements",
    ],
    humanMustDo: [
      "Create Google Cloud project",
      "Configure consent screen",
      "Add test users",
      "Submit verification if required",
    ],
    sources: [
      {
        url: "https://developers.google.com/identity/protocols/oauth2",
        title: "OAuth 2.0 Overview",
        type: "official_docs",
      },
      {
        url: "https://support.google.com/cloud/answer/13463073",
        title: "OAuth consent screen verification",
        type: "official_docs",
      },
    ],
    uncertainties: [
      "Exact verification timeline varies and was not directly tested",
    ],
    tested: ["Checked official Google OAuth docs"],
    notTested: ["Did not complete production verification"],
    confidence: "medium",
    generatedBy: "seeded",
    generatedAt: "2026-11-04T00:00:00.000Z",
  },
];