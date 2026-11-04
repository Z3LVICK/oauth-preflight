import { Guide } from "./type";

export function guideToMarkdown(guide: Guide) {
  return `
# ${guide.appName} OAuth Setup Guide

Generated: ${guide.generatedAt}
Confidence: ${guide.confidence}

## Summary

${guide.summary}

## Effort

- Difficulty: ${guide.difficulty}
- Time to first working setup: ${guide.timeToFirstWorkingSetup}
- Approval wait: ${guide.approvalWait}

## Approval

Required: ${guide.approvalRequired ? "Yes" : "No"}

${guide.approvalSummary}

### Requirements

${guide.requirements.map((item) => `- ${item}`).join("\n") || "- None identified"}

### Known blockers

${guide.blockers.map((item) => `- ${item}`).join("\n") || "- None identified"}

## Setup steps

${guide.steps
  .map(
    (step, i) => `### ${i + 1}. ${step.title}

${step.detail}

Owner: ${step.owner}
${step.time ? `Estimated time: ${step.time}` : ""}
`.trim()
  )
  .join("\n\n")}

## What the agent can do

${guide.agentCanDo.map((item) => `- ${item}`).join("\n")}

## What the human must do

${guide.humanMustDo.map((item) => `- ${item}`).join("\n")}

## Sources

${guide.sources
  .map((source) => `- [${source.title}](${source.url}) (${source.type})`)
  .join("\n")}

## Uncertainties

${guide.uncertainties.map((item) => `- ${item}`).join("\n")}

## Tested

${guide.tested.map((item) => `- ${item}`).join("\n")}

## Not tested

${guide.notTested.map((item) => `- ${item}`).join("\n")}
`.trim();
}