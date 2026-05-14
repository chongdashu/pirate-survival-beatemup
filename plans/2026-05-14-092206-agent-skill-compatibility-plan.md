# Agent Skill Compatibility Plan

Linked prompts file: `prompts/2026-05-14-092206-agent-skill-compatibility-prompts.md`
Linked learnings file: `learnings/2026-05-14-092206-agent-skill-compatibility-learnings.md`

## Goal

Preserve a durable record of the skill compatibility migration and commit the new agent-facing and Claude-facing skill directories so the repository exposes Phaser guidance in formats usable by more AI tools.

## Approach

1. Inspect the current Git working tree and confirm the scope of uncommitted changes.
2. Review the new `.agents/` and `.claude/skills/` files enough to verify they are skill documentation and references, not runtime code.
3. Create linked capture artifacts under `prompts/`, `plans/`, and `learnings/`.
4. Stage the intended new skill directories and capture artifacts.
5. Validate a Conventional Commit message and create the commit.

## Verification

Confirm the staged files are limited to `.agents/`, `.claude/skills/`, and the capture files. Because the change is documentation and tool-instruction content rather than application code, no runtime build or unit test is required unless the staged diff reveals code changes.
