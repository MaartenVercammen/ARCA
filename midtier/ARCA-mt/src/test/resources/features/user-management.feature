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
    When a PUT request is made to "/users/1/roles" with valid roles data
    Then the response status is 200
    And the response body contains the updated user
