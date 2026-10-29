# Feature Factory Workspace

This directory contains the Feature Factory artifacts for every feature developed in the ARCA monorepo.

## What is the Feature Factory?

The Feature Factory is a sequential, gate-driven workflow that enforces Spec-Driven Development:

```
Grilling → Glossary + Mental Map → Specification → Plan → Scaffold → Tests (fail) → Implementation → Reviews → PR Handoff → Retrospective
```

No gate may be skipped. Each gate requires an explicit approval before the next begins.

## Directory Structure

```
docs/.factory/
└── <feature-name>/
    ├── glossary.md        # Domain terms agreed during grilling
    ├── mental-map.md      # Agreed product shape and decisions
    ├── specification.md   # Behavioural acceptance criteria (Gherkin)
    ├── plan.md            # Language adapter, tasks, file list
    ├── decisions.md       # Dated approvals, rejections, rewind reasons
    └── retrospective.md   # Post-implementation findings and improvements
```

## Starting a New Feature

1. Run the grilling session to reach shared understanding.
2. Create `docs/.factory/<feature-name>/` and populate `glossary.md` and `mental-map.md`.
3. Write `specification.md` with Gherkin acceptance criteria — **behaviour only**, no structural setup.
4. Get explicit `approve specification` before writing `plan.md`.
5. Get explicit `approve plan` before scaffolding or writing tests.
6. Write failing tests derived from the Gherkin scenarios.
7. Implement until all tests pass.
8. Run specification review, then standards review.
9. Prepare PR handoff. Get explicit `approve PR-ready output`.
10. Write `retrospective.md`. Get explicit `approve retrospective`.

## Approval Keywords

| Keyword                   | Effect                                 |
|---------------------------|----------------------------------------|
| `approve specification`   | Unlocks planning                       |
| `approve plan`            | Unlocks scaffolding and test authoring |
| `approve PR-ready output` | Unlocks retrospective                  |
| `approve retrospective`   | Feature complete                       |

Rejections must be recorded in `decisions.md` with a date and reason.
