---
feature: spec-driven-setup
artifact: specification
status: pending-approval
updated_stage: specification
---

# Specification — Spec-Driven Development Setup

## Overview

Wire the ARCA monorepo for Spec-Driven Development. Structural setup details (dependencies, file locations, CI config)
are documented in [`docs/spec-driven-development.md`](../spec-driven-development.md). This specification captures only
the **behavioural acceptance criteria** in Gherkin.

---

## Acceptance Criteria

### User Management API

```gherkin
Feature: User Management

  Scenario: List users as authenticated USER
    Given a user with role USER is authenticated
    When a GET request is made to "/users"
    Then the response status is 200
    And the response body is a JSON array

  Scenario: Create user as ADMIN
    Given a user with role ADMIN is authenticated
    When a POST request is made to "/users" with valid user data
    Then the response status is 201
    And the response body contains the created user

  Scenario: Create user is forbidden for USER role
    Given a user with role USER is authenticated
    When a POST request is made to "/users" with valid user data
    Then the response status is 403

  Scenario: Update user roles as ADMIN
    Given a user with role ADMIN is authenticated
    And a target user exists
    When a PUT request is made to "/users/{id}/roles" with valid roles data
    Then the response status is 200
    And the response body contains the updated user
```

---

### Login

```gherkin
Feature: Login

  Scenario: Successful login
    Given the user is on the login page
    When the user enters valid credentials and submits the form
    Then the user is redirected to the home screen

  Scenario: Failed login with invalid credentials
    Given the user is on the login page
    When the user enters invalid credentials and submits the form
    Then an error message is displayed
    And the user remains on the login page
```
