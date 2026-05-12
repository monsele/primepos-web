---
name: bmad-update-app-test-guide
description: 'Refresh the canonical PrimePOS app testing guide from the current implementation, mock data, and validation behavior.'
---

# App Test Guide Maintenance Workflow

**Goal:** Keep `docs/testing/app-test-guide.md` accurate, human-readable, and aligned with the current PrimePOS implementation.

## Rules

- Update `docs/testing/app-test-guide.md` only. Do not create a duplicate guide file.
- Read the current implementation before editing the guide.
- Prefer implemented, reachable flows over planned or placeholder screens.
- Keep the guide simple for human testers. Do not turn it into an agent memo.
- Preserve the section order from `template.md`.
- Every documented credential, value, message, and limit must come from the current codebase behavior.

## Required Inputs To Inspect Before Editing

Read these files first:

- `docs/testing/app-test-guide.md`
- `primepos-web/package.json`
- `primepos-web/src/App.tsx`
- `primepos-web/src/api/auth.ts`
- `primepos-web/src/api/accounts.ts`
- `primepos-web/src/api/loans.ts`
- `primepos-web/src/api/groups.ts`
- `primepos-web/src/api/transactions.ts`

Then inspect the relevant feature files for any flow you touch, especially:

- Navigation entry points such as dashboard quick actions and menu screens
- Screen components that reveal actual labels and expected results
- Hooks that define validation rules, success messages, and invalid cases

## Update Process

1. Inventory which flows are actually reachable in the current UI.
2. Separate those flows into:
   - Implemented and testable now
   - Present but outside the main guide
   - Placeholder, pending, or not yet ready
3. Cross-check all test values against current mocks or current validation behavior.
4. Update the guide using `template.md` as the section order.
5. Keep the quick checklist short and practical.
6. For each detailed scenario, include:
   - Where to open the flow
   - Successful values
   - Expected result
   - Useful invalid checks where applicable
7. Refresh the `Last checked` date.

## Validation Before Finishing

- Confirm `docs/testing/app-test-guide.md` still exists at the same path.
- Confirm no second testing guide was created under `docs/` or `.agents/skills/`.
- Confirm every code-derived value still matches the current files.
- If app code was not changed, note that no runtime validation was required.

## Output Standard

The finished guide should help a teammate quickly answer:

- How do I run the app locally?
- How do I log in?
- Which flows can I test today?
- Which exact values should I use?
- What should happen if the flow works?
- Which screens are not yet ready or are intentionally out of scope?
