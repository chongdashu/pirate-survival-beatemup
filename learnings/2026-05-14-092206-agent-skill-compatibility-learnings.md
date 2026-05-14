# Agent Skill Compatibility Learnings

Related records:
- `plans/2026-05-14-092206-agent-skill-compatibility-plan.md`
- `prompts/2026-05-14-092206-agent-skill-compatibility-prompts.md`

## Context

This session captured and committed a repository organization change that makes game-development skills available through `.agents/` and Claude-compatible skill paths.

## What Happened

The working tree showed new `.agents/` and `.claude/` directories. The `.agents` directory contains Phaser 3 and Phaser 4 skill packages with reference material. The `.claude/skills` directory contains Claude-oriented variants for the same skill families.

## Result Quality

The change is isolated to AI-tool skill documentation and session-capture artifacts. It does not alter the Phaser application runtime.

## Decisions

Keep the new `.agents/` layout as the compatibility-facing location for shared AI-agent usage, and keep `.claude/skills/` as the Claude-specific variant location.
