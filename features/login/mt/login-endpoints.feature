Feature: Login Endpoints
  As a client application
  I want to verify user credentials via the login endpoint
  So that I can grant access to the system

  Scenario: Successful login with correct credentials
    Given a user exists with username "john_doe" and password "SecurePass123"
    When I send a POST request to "/api/login" with:
      | username | john_doe      |
      | password | SecurePass123 |
    Then the response status should be 200
    And the response body should contain a valid authentication token
    And the response body should contain user details

  Scenario: Failed login with unknown user
    Given no user exists with username "unknown_user"
    When I send a POST request to "/api/login" with:
      | username | unknown_user  |
      | password | somePassword  |
    Then the response status should be 401
    And the response body should contain error message "User not found"

  Scenario: Failed login with incorrect password
    Given a user exists with username "john_doe" and password "SecurePass123"
    When I send a POST request to "/api/login" with:
      | username | john_doe      |
      | password | WrongPass456  |
    Then the response status should be 401
    And the response body should contain error message "Invalid credentials"

  Scenario: Failed login due to missing fields
    When I send a POST request to "/api/login" with:
      | username | john_doe |
    Then the response status should be 400
    And the response body should contain error message "Password is required"
