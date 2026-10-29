# Spec-Driven Development in ARCA

This document describes the three pillars of Spec-Driven Development (SDD) in the ARCA monorepo and how to use them
day-to-day.

---

## Pillar 1 — Contract-First API (OpenAPI)

### Location

```
midtier/api-specs/
└── user-management.yaml   # Hand-authored OpenAPI 3.x spec
```

### Workflow

1. **Author the spec first** — before writing any controller or service code, create or update the relevant YAML file in
   `midtier/api-specs/`.
2. **Review the contract** — get team sign-off on the spec (endpoints, request/response shapes, security).
3. **Implement against the spec** — the Spring Boot controller must match the contract exactly.
4. **Validate at runtime** — springdoc-openapi serves Swagger UI at `http://localhost:8080/swagger-ui.html`. Compare the
   live docs against the hand-authored spec.

### Adding a new API spec

- Create `midtier/api-specs/<domain>.yaml` following OpenAPI 3.x format.
- Use `$ref` to share schemas across files where possible.
- Declare `BearerAuth` security on every protected endpoint.

---

## Pillar 2 — BDD: Midtier (Cucumber JVM)

### Location

```
midtier/ARCA-mt/src/test/
├── resources/features/
│   └── user-management.feature   # Gherkin scenarios
└── java/dev/emvee/arcamt/cucumber/
    ├── CucumberIT.java            # JUnit 5 suite runner
    ├── CucumberSpringConfig.java  # Spring Boot test context
    └── UserManagementStepDefs.java # Step definitions
```

### Dependencies (pom.xml)

- `io.cucumber:cucumber-java`
- `io.cucumber:cucumber-spring`
- `io.cucumber:cucumber-junit-platform-engine`

### Running

```bash
cd midtier/ARCA-mt
mvn --batch-mode --no-transfer-progress verify
```

Cucumber scenarios run as part of the standard Maven test lifecycle.

### Writing a new feature

1. Add a `.feature` file to `src/test/resources/features/`.
2. Write Gherkin scenarios derived from the approved `specification.md`.
3. Add step definitions in `src/test/java/dev/emvee/arcamt/cucumber/`.
4. Run `mvn verify` — scenarios must **fail** before implementation begins.
5. Implement the feature until all scenarios pass.

---

## Pillar 3 — BDD: Frontend (Cucumber.js)

### Location

```
frontend/ARCA-fe/src/features/
├── login.feature                  # Gherkin scenarios
└── step-definitions/
    └── login.steps.ts             # Step definitions (Vitest assertions)
```

### Configuration

- `frontend/ARCA-fe/cucumber.js` — Cucumber.js config (paths, require, format)

### Running

```bash
cd frontend/ARCA-fe
yarn test:bdd
```

### Writing a new feature

1. Add a `.feature` file to `src/features/`.
2. Write Gherkin scenarios derived from the approved `specification.md`.
3. Add step definitions in `src/features/step-definitions/`.
4. Run `yarn test:bdd` — scenarios must **fail** before implementation begins.
5. Implement the feature until all scenarios pass.

---

## Pillar 4 — Feature Factory Workflow

Every new feature must go through the Feature Factory gates. See [`docs/.factory/README.md`](.factory/README.md) for the
full workflow.

### Quick reference

| Gate                  | Artifact                       | Approval required              |
|-----------------------|--------------------------------|--------------------------------|
| Grilling              | (conversation)                 | Shared understanding confirmed |
| Glossary + Mental Map | `glossary.md`, `mental-map.md` | —                              |
| Specification         | `specification.md`             | `approve specification`        |
| Plan                  | `plan.md`                      | `approve plan`                 |
| Scaffold + Tests      | code                           | Tests must fail                |
| Implementation        | code                           | Tests must pass                |
| Reviews               | (conversation)                 | Both reviews pass              |
| PR Handoff            | (summary)                      | `approve PR-ready output`      |
| Retrospective         | `retrospective.md`             | `approve retrospective`        |

---

## CI Enforcement

The GitHub Actions workflow (`.github/workflows/docker-image.yml`) enforces SDD on every push and pull request:

| Job        | Command                   | What it checks                      |
|------------|---------------------------|-------------------------------------|
| `midtier`  | `mvn verify`              | Unit tests + Cucumber JVM scenarios |
| `frontend` | `yarn test --watch=false` | Vitest unit tests                   |
| `frontend` | `yarn test:bdd`           | Cucumber.js BDD scenarios           |
