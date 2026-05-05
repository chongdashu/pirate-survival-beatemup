---
name: capture
description: "Save session prompts, plans, and learnings to their canonical directories. Use when wrapping up a task, after planning, after completing work, or when the user says to save/capture/log the session."
argument-hint: "[slug]"
---

# Capture

Save the current session's conversation artifacts — prompts, plans, and learnings — into their canonical repo directories so the full workflow is preserved and cross-linked.

## Philosophy

Every meaningful session produces three kinds of knowledge:

1. **Prompts** — the raw user intent, preferences, clarifications, and the exact model prompts or invocations used. This is the "what was asked and how it was executed."
2. **Plans** — the structured approach: goal, steps, verification. This is the "what was decided."
3. **Learnings** — outcomes, surprises, quality notes, and decisions for next time. This is the "what was learned."

These three files form a linked triple. Each one references the other two. They are the durable record of the session — not ephemeral conversation, but curated artifacts.

## When To Capture

- After a planning phase produces a concrete plan
- After a task is completed and there are outcomes to record
- When the user explicitly asks to save, capture, or log
- At natural milestones where prompts, decisions, or learnings would otherwise be lost

You do not need all three files every time. Capture what exists:
- Planning-only session? Prompts + plan.
- Quick experiment? Prompts + learnings.
- Full workflow? All three.

## File Naming Convention

All files share the same timestamp and slug:

```
YYYY-MM-DD-HHMMSS-<slug>
```

- Timestamp: use the session start time or the time of the primary user request
- Slug: short, hyphenated, descriptive (e.g., `pirate-walk-v2`, `fal-ai-video-experiment-harness`)
- If the user provides a slug argument via `/capture <slug>`, use it
- If no slug is provided, derive one from the conversation topic

## Output Locations

```
prompts/<timestamp>-<slug>-prompts.md
plans/<timestamp>-<slug>-plan.md
learnings/<timestamp>-<slug>-learnings.md
```

## Prompts File Template

```markdown
# <Title> Prompts

Linked plan file: `plans/<timestamp>-<slug>-plan.md`
Linked learnings file: `learnings/<timestamp>-<slug>-learnings.md`

## User Verbatim

Author: `User`

Exact user message(s):

\```text
<paste the user's exact prompt(s), including typos and formatting>
\```

## User Preferences

Author: `User`

Preferences captured during the session:

\```text
<any stated preferences, constraints, or clarifications from the user>
\```

## Assistant Summary

\```text
<concise summary of the intent and scope as understood by the assistant>
\```

## Docs Studied

Author: `Assistant`

\```text
<list of URLs or docs read during the session, if any>
\```

## Working Findings

Author: `Assistant`

\```text
<key findings, research notes, or technical details discovered during planning/execution>
\```

## Model Prompts Used

<for each model prompt sent, include:>

### <Model Name> Prompt Sent

\```text
<exact prompt text>
\```

### <Model Name> Exact Invocation

\```bash
<exact command or API call>
\```

### Outcome

\```text
<what happened — success, failure, moderation block, quality notes>
\```
```

Omit sections that don't apply. The "User Verbatim" section is always required. Other sections are included only when relevant content exists.

## Plan File Template

```markdown
# <Title> Plan

Linked prompts file: `prompts/<timestamp>-<slug>-prompts.md`
Linked learnings file: `learnings/<timestamp>-<slug>-learnings.md`

## Goal

<one-paragraph goal statement>

## Approach

<structured approach — numbered steps, sub-bullets for detail>

## Verification

<how to confirm the work is correct — build checks, visual confirmation, test commands>
```

## Learnings File Template

```markdown
# <Title> Learnings

Related records:
- `plans/<timestamp>-<slug>-plan.md`
- `prompts/<timestamp>-<slug>-prompts.md`

## Context

<brief context for what this session was about>

## Initial Hypothesis

<what was expected to happen, if applicable>

## What Happened

<factual account of outcomes — what worked, what didn't, what surprised>

## Result Quality

<quality assessment of outputs, comparison notes if applicable>

## Decisions

<decisions made during or as a result of this session — what to keep, what to change next time>
```

Omit sections that don't apply. "Context" and "What Happened" are always required. Other sections are included only when relevant.

## Cross-Linking

Every file must link to its siblings. Use relative paths from the repo root:
- Prompts links to plan and learnings
- Plan links to prompts and learnings
- Learnings links to plan and prompts

If only two files are created (e.g., no learnings yet), link only to the sibling that exists.

## Anti-Patterns

- **Don't fabricate content**: Only capture what actually happened in the session. If there are no learnings yet, don't create a learnings file.
- **Don't over-summarize user verbatim**: Paste the user's exact words. Typos, formatting, and all.
- **Don't merge sessions**: Each capture is one timestamp, one slug, one coherent unit of work.
- **Don't skip the cross-links**: The linked triple is the whole point.
- **Don't include ephemeral conversation**: Capture decisions and artifacts, not back-and-forth chatter.
