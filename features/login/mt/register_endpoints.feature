Feature: Registration Endpoints
  As a new user
  I want to create an account via the registration endpoint
  So that I can use the application features

  Scenario: Successful registration with valid data
    Given no user exists with username "new_user"
    When I send a POST request to "/api/register" with:
      | username | new_user        |
      | password | StrongPass123! |
      | email    | new@example.com |
    Then the response status should be 201
    And the response body should confirm account creation
    And a user should exist in the database with username "new_user"

  Scenario: Failed registration when user already exists
    Given a user exists with username "existing_user"
    When I send a POST request to "/api/register" with:
      | username | existing_user   |
      | password | password123     |
      | email    | old@example.com |
    Then the response status should be 409
    And the response body should contain error message "Username already taken"

  Scenario: Failed registration with weak password
    When I send a POST request to "/api/register" with:
      | username | weak_user       |
      | password | 123             |
      | email    | weak@example.com|
    Then the response status should be 400
    And the response body should contain error message "Password does not meet security requirements"

  Scenario: Failed registration with invalid email format
    When I send a POST request to "/api/register" with:
      | username | mail_user       |
      | password | ValidPass123!   |
      | email    | not-an-email    |
    Then the response status should be 400
    And the response body should contain error message "Invalid email format"
