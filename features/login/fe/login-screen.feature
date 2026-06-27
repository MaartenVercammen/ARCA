Feature: Login Screen UI and Validation
  As a user
  I want to see a clear login interface with validation
  So that I can provide the correct credentials and understand any input errors

  Background:
    Given I am on the login page

  Scenario: Login screen field presence
    Then I should see a "Username" input field
    And I should see a "Password" input field
    And I should see a "Login" button
    And I should see a "Register" link

  Scenario: Validation for empty fields
    When I click the "Login" button without entering any data
    Then I should see a validation error "Username is required"
    And I should see a validation error "Password is required"

  Scenario: Validation for username/email format
    When I enter "invalid-user" in the "Username" field
    And I enter "password123" in the "Password" field
    And I click the "Login" button
    Then I should see a validation error "Please enter a valid username or email"

  Scenario: Password visibility toggle
    Then the "Password" field should be masked by default
    When I click the password visibility toggle
    Then the "Password" field should be visible
    When I click the password visibility toggle again
    Then the "Password" field should be masked again
