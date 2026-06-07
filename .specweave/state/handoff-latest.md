# Work Handoff

- Doc path: D:\Dev Projects\timorup\.specweave\state\handoff-latest.md
- Doc link: [D:\Dev Projects\timorup\.specweave\state\handoff-latest.md](D:\Dev Projects\timorup\.specweave\state\handoff-latest.md)
- Diff file: D:\Dev Projects\timorup\.specweave\state\handoff-latest.diff
- Generated: 2026-06-07T02:26:00.919Z
- Workspace: D:\Dev Projects\timorup (SpecWeave)
- Git: branch `feat/comp-A-delete-dead` @ `ea1e68bd`

## Where I Left Off

**Why handing off:** auto: pre-compact
_No active SpecWeave increment — this is a git + interview handoff._

## Done / Pending

_No increment task/AC state available._

## Key Decisions & Gotchas

_No decisions recorded._

**Ambient rules (config.json):**
- Test mode: TDD
- Coverage target: 80%

## Files Touched

**UNCOMMITTED** — commit, stash, or keep editing BEFORE doing anything destructive.

```
M .specweave/state/banner-last-check.json
 D .specweave/state/context-pressure.json
 M .specweave/state/event-queue/pending.jsonl
 M .specweave/state/handoff-latest.diff
 M .specweave/state/handoff-latest.md
 D .specweave/state/prompt-health-alert.json
 M .specweave/state/prompt-health.json
 M CLAUDE.md
 M CLAUDE.md.bak
 M vskill.lock
?? .codegraph/daemon.pid
```

```
.codegraph/daemon.pid                      |     6 +
 .specweave/state/banner-last-check.json    |     6 +-
 .specweave/state/context-pressure.json     |     1 -
 .specweave/state/event-queue/pending.jsonl |    40 -
 .specweave/state/handoff-latest.diff       | 25686 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-------------------
 .specweave/state/handoff-latest.md         |    54 +-
 .specweave/state/prompt-health-alert.json  |     1 -
 .specweave/state/prompt-health.json        |     2 +-
 CLAUDE.md                                  |    64 +-
 CLAUDE.md.bak                              |   162 +-
 vskill.lock                                |     4 +-
 11 files changed, 21425 insertions(+), 4601 deletions(-)
```

Full uncommitted diff: `D:\Dev Projects\timorup\.specweave\state\handoff-latest.diff` — read it or run `git apply --check` against it to see the exact edits.

## Exact Next Steps

_No explicit next step recorded — review the summary above._

## How To Resume

If the doc path above does NOT exist on the machine you are reading this on, STOP and ask the user to paste the handoff — do not improvise context.

To recover the ORIGINAL transcript (optional), find your source session per tool:

### Claude Code
- Find session: ls ~/.claude/projects/<munged-cwd>/ (munge: every non-alphanumeric char → "-", runs NOT collapsed; e.g. /Users/antonabyzov/Projects/github/specweave-umb/.claude-worktrees/x → -Users-antonabyzov-Projects-github-specweave-umb--claude-worktrees-x)
- Resume: `claude -r <uuid>`

### Codex
- Find session: ls ~/.codex/sessions/ (newest dir = most recent session)
- Resume: `codex resume <uuid>   (or: codex resume --last)`

### OpenCode
- Find session: opencode sessions list
- Resume: `opencode -s <id>   (long form: opencode --session <id>)`

### Gemini CLI
- Find session: run /chat list inside the Gemini session to see saved tags
- Resume: `/chat resume <tag>`

### Antigravity
- Find session: open the Antigravity Agent Manager and pick the prior task thread
- Resume: `resume the thread from the Antigravity Agent Manager`

### Aider
- Find session: aider keeps .aider.chat.history.md in the repo root
- Resume: `aider --restore-chat-history`

## Redaction

_No token-like strings were detected._

_Scrubbing is heuristic (regex baseline). An empty redaction list is NOT a guarantee this file is clean — review before sharing or committing._

---
<!-- Doc format v1 -->