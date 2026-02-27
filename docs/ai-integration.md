# AI Integration Guide

This document outlines AI integration options for BrightPath.

## Recommended AI Features

### 1. Assignment Complexity Analyzer (High Value)

Use AI to analyze assignment descriptions and estimate:
- Time required
- Difficulty level
- Recommended start date
- Skills needed

```typescript
// Example API route: /api/analyze-assignment
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function analyzeAssignment(assignment: {
  title: string;
  description: string;
  dueDate: string;
}) {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Analyze this school assignment and provide:
1. Estimated time to complete (in hours)
2. Difficulty level (1-5)
3. Recommended start date
4. Key skills needed

Assignment:
Title: ${assignment.title}
Description: ${assignment.description}
Due Date: ${assignment.dueDate}

Respond in JSON format.`,
      },
    ],
  });

  return response;
}
```

### 2. Study Plan Generator

AI creates personalized study schedules by breaking down assignments into manageable chunks across available time.

### 3. Smart Prioritization

AI ranks assignments based on due date, complexity, weight, and student's historical performance patterns.

### 4. AI Tutor / Q&A

Chat interface where students can ask questions about their assignments and get explanations.

### 5. Progress Insights

AI analyzes completion patterns and provides actionable feedback like "You tend to struggle with math on Mondays."

---

## API Pricing (as of 2025)

| Provider | Model | Input | Output | Cost per Assignment* |
|----------|-------|-------|--------|---------------------|
| **Anthropic** | Claude Sonnet 4.5 | $3/1M tokens | $15/1M tokens | ~$0.001 |
| **Anthropic** | Claude Haiku 4.5 | $0.80/1M tokens | $4/1M tokens | ~$0.0003 |
| **OpenAI** | GPT-4o | $2.50/1M tokens | $10/1M tokens | ~$0.0008 |
| **OpenAI** | GPT-4o-mini | $0.15/1M tokens | $0.60/1M tokens | ~$0.00005 |

*Assuming ~500 tokens input (assignment details) + ~300 tokens output (analysis)

## Monthly Cost Estimates

| Usage Level | Assignments/Month | Haiku 4.5 | GPT-4o-mini |
|-------------|-------------------|-----------|-------------|
| Light (1 student) | 50 | **$0.02** | **$0.003** |
| Medium (100 students) | 5,000 | **$1.50** | **$0.25** |
| Heavy (1,000 students) | 50,000 | **$15** | **$2.50** |

## Recommended Approach

Start with **Claude Haiku 4.5** or **GPT-4o-mini**:
- Fast response times (<1 second)
- More than capable for assignment analysis
- Essentially free at small scale
- Easy to upgrade to larger models later

## SDK Options

| Provider | Package | Best For |
|----------|---------|----------|
| **Anthropic Claude** | `@anthropic-ai/sdk` | Complex reasoning, long documents |
| **OpenAI** | `openai` | General purpose, fast |
| **Vercel AI SDK** | `ai` | Streaming UI, multi-provider support |

## Installation

```bash
# Anthropic
npm install @anthropic-ai/sdk

# OpenAI
npm install openai

# Vercel AI SDK (supports both + streaming)
npm install ai @ai-sdk/anthropic @ai-sdk/openai
```

## Environment Variables

Add to `.env.local`:

```env
# Choose one or both
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
```

## Next Steps

1. Choose a provider and install the SDK
2. Add API keys to environment variables
3. Create API route at `src/app/api/analyze/route.ts`
4. Integrate with Google Classroom assignment data
5. Display recommendations in the student dashboard
