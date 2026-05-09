---
story_id: 5.4
story_key: 5-4-app-test-guide-and-maintenance-skill
epic: 5
epic_title: Account Services
title: App Test Guide & Maintenance Skill
status: ready-for-dev
source_files:
  - epics.md Â§Story 5.4
  - architecture.md Â§2.4, Â§10
  - user-request 2026-05-08
created: 2026-05-08
dependencies:
  - 5-2-account-balance-inquiry
  - 5-3-account-statement
---

# Story 5.4: App Test Guide & Maintenance Skill

## User Story
As a product or engineering teammate, I want a simple testing guide with real test values and a BMAD maintenance skill so that anyone can reliably validate the app and keep the guide current as features evolve.

## Business Context
The app now has enough implemented flows that ad hoc testing is slowing everyone down. A single plain-English guide with real working values will reduce confusion for manual QA, demos, and handoff. A dedicated BMAD skill keeps that guide from going stale as new stories land.

## Acceptance Criteria (BDD)

```gherkin
Scenario: Testing guide exists with real values
  Given I open the app testing guide markdown file
  Then I see simple setup steps for running the app locally
  And I see the current working login credentials
  And I see test values for key implemented flows
  And each value is based on actual repo mocks or current app behavior

Scenario: Guide covers the main implemented flows
  Given I am using the testing guide
  Then I can follow documented steps to verify:
    - Login
    - Cash In
    - Cash Out
    - Loan Repayment
    - Loan Inquiry
    - Account Balance
    - New Savings Account
  And the guide clearly states expected results and known invalid test values where applicable

Scenario: BMAD skill updates the guide
  Given a teammate runs the dedicated BMAD skill for the test guide
  When they ask it to refresh the guide after feature changes
  Then it updates the same markdown file
  And it scans current implementation files and mock data before editing
  And it preserves a simple, human-readable structure
```

---

## Developer Context

### What Exists Today

| File | Current State |
|------|---------------|
| `primepos-web/src/api/auth.ts` | Contains the current mock login credential and officer profile |
| `primepos-web/src/api/accounts.ts` | Contains valid and invalid account-search behaviors plus savings product mocks |
| `primepos-web/src/api/loans.ts` | Contains valid and invalid loan-search behaviors and repayment mocks |
| `primepos-web/src/api/groups.ts` | Contains mock group data and searchable group terms |
| `primepos-web/src/api/transactions.ts` | Contains transaction posting mocks for Cash In / Cash Out |
| `primepos-web/src/App.tsx` | Source of the currently wired screens and navigation coverage |
| `primepos-web/package.json` | Local run/test/lint/build commands |
| `.agents/skills/` | Existing local BMAD skill directory structure |

**What does NOT exist yet:**
- A canonical app testing guide in `docs/`
- A dedicated BMAD skill for maintaining that guide
- A documented source-of-truth list of current mock test values

### Files to Create

| File | Purpose |
|------|---------|
| `docs/testing/app-test-guide.md` | Canonical plain-English guide for manually testing the app |
| `.agents/skills/bmad-update-app-test-guide/SKILL.md` | BMAD skill that updates the test guide from current implementation context |
| `.agents/skills/bmad-update-app-test-guide/template.md` | Reusable structure for keeping guide sections consistent |

### Files to Update

| File | Change |
|------|--------|
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | Track Story 5.4 as ready-for-dev |

---

## Technical Requirements

### Testing Guide Scope

The guide must stay intentionally simple and practical. It should explain:
- How to start the app locally
- How to log in
- Which implemented screens/flows can be tested today
- Which exact values to enter for successful and unsuccessful scenarios
- What result the tester should expect to see

### Required Test Values

The guide must derive values from source files, including:
- Login credential from `primepos-web/src/api/auth.ts`
- Valid and invalid account numbers from `primepos-web/src/api/accounts.ts`
- Valid and invalid loan identifiers from `primepos-web/src/api/loans.ts`
- Representative group search terms from `primepos-web/src/api/groups.ts`
- Savings-product choices and realistic form values from `primepos-web/src/api/accounts.ts` and current screen implementations

### Skill Responsibilities

The maintenance skill must:
- Update `docs/testing/app-test-guide.md` and no duplicate guide file
- Read current implementation files before editing the guide
- Prefer implemented flows over planned-only flows
- Refresh test values when mocks or current UI behavior change
- Keep the guide written for humans, not as a vague agent memo
- Preserve a stable section order so teammates always know where to look

### Output Structure Expectations

The guide should include sections such as:
- Local setup
- Login
- Quick flow checklist
- Detailed flow-by-flow scenarios
- Test values reference
- Known gaps or not-yet-implemented flows

### Non-Goals

This story does **not** create new app features or new runtime test frameworks. It creates documentation and a maintenance skill around existing behavior.

---

## Architecture Compliance

- Follow the repo's existing documentation placement by creating durable reference material under `docs/`
- Keep the skill local to `.agents/skills/` so it is discoverable alongside the project's BMAD skills
- Do not add runtime dependencies for this story
- If any app code is touched while gathering or clarifying values, it must still respect the React + TypeScript + Vite architecture documented in `architecture.md`

---

## Library / Framework Requirements

- No new libraries are needed
- Use plain Markdown for the guide
- Use the existing local skill format already present in `.agents/skills/*/SKILL.md`
- Any validation commands referenced in the guide must match `primepos-web/package.json`

---

## File Structure Requirements

```text
docs/
  testing/
    app-test-guide.md
.agents/
  skills/
    bmad-update-app-test-guide/
      SKILL.md
      template.md
```

---

## Testing Requirements

### Documentation Validation

| Check | Description |
|------|-------------|
| `Guide accuracy` | Cross-check every listed credential/value against current source files before finalizing |
| `Guide usability` | A teammate should be able to follow the guide from setup to at least one successful result in each documented implemented flow |
| `Guide clarity` | Language stays simple, direct, and non-duplicative |

### Skill Validation

| Check | Description |
|------|-------------|
| `Skill scope` | Skill updates the existing guide rather than creating parallel files |
| `Skill behavior` | Skill instructions explicitly require scanning current implementation and mock data before editing |
| `Skill output quality` | Skill preserves the guide's simple structure and refreshes scenarios/test values accurately |

### Repo Validation

- If only docs and skill files are changed, document that no runtime code validation was required
- If any `primepos-web` runtime file is changed, run the relevant repo validation commands from `package.json`

---

## Previous Story Intelligence

- Story 5.2 introduced the Account Balance flow and now provides a concrete, testable Services-screen scenario that should be documented in the guide.
- Story 5.3 is ready-for-dev but not implemented yet, so the guide/skill must distinguish implemented flows from future or pending ones instead of pretending all planned stories are testable now.
- Existing feature stories rely heavily on mock API data; this story should centralize those values so future testing instructions stay aligned with the code.

---

## Git Intelligence Summary

- Recent work has continued the pattern of story-by-story feature delivery inside `primepos-web/src/features/`
- No existing commit pattern suggests a dedicated testing-guide document yet, so this story should establish the canonical location and maintenance workflow cleanly

---

## Latest Technical Information

- Current architecture specifies `Vitest` for unit/integration testing and `Playwright` for E2E testing, but this story is documentation-first and should not introduce new tooling requirements beyond what the repo already declares

---

## Project Context Reference

- No `project-context.md` was found during story creation, so implementation should rely on the current repository structure, the planning artifacts, and source-of-truth mock data in `primepos-web/src/api/*`

---

## Tasks/Subtasks

- [ ] **Task 1: Define the testing-guide scope**
  - [ ] 1.1 Inventory currently implemented user-facing flows from `primepos-web/src/App.tsx` and linked screens
  - [ ] 1.2 Inventory real test values from mock APIs and current feature/test files
- [ ] **Task 2: Create the canonical testing guide**
  - [ ] 2.1 Create `docs/testing/app-test-guide.md`
  - [ ] 2.2 Document setup, login, flow-by-flow steps, expected outcomes, and test values
  - [ ] 2.3 Clearly separate implemented flows from not-yet-implemented or pending stories
- [ ] **Task 3: Create the BMAD maintenance skill**
  - [ ] 3.1 Create `.agents/skills/bmad-update-app-test-guide/SKILL.md`
  - [ ] 3.2 Create `.agents/skills/bmad-update-app-test-guide/template.md`
  - [ ] 3.3 Ensure the skill instructs the agent to inspect current implementation, mocks, and relevant tests before updating the guide
- [ ] **Task 4: Validate documentation accuracy**
  - [ ] 4.1 Cross-check every documented value against source files
  - [ ] 4.2 Perform a manual smoke pass of the documented flows against the running app where feasible
- [ ] **Task 5: Validation & regression**
  - [ ] 5.1 Confirm no duplicate testing-guide files were introduced
  - [ ] 5.2 If app runtime files changed, run relevant repo validations
  - [ ] 5.3 Verify the story acceptance criteria are fully covered

---

## Dev Agent Record

### Debug Log
<!-- Developer notes on issues encountered, workarounds, environment quirks -->

### Implementation Plan
<!-- Record technical decisions, approach notes, architecture choices as tasks are completed -->

### Completion Notes
<!-- Summarize what was actually implemented and tested -->

---

## File List
<!-- New, modified, and deleted files relative to repo root -->

---

## Change Log
<!-- Summary of changes per session -->
---

## Completion Checklist

- [ ] `docs/testing/app-test-guide.md` exists and is easy to follow
- [ ] Real current test values are documented from source files
- [ ] Implemented flows are distinguished from pending/unimplemented ones
- [ ] BMAD maintenance skill exists under `.agents/skills/bmad-update-app-test-guide/`
- [ ] Skill updates the same guide and scans implementation context before editing
- [ ] No duplicate testing guide was created

---

*Story context compiled from Epic 5 planning, architecture testing guidance, repository source files, and the user request.*
*Ready for development.*
