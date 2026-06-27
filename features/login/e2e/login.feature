Feature: User Login
  As a user
  I want to be able to log in to the application
  So that I can access my personalized home page

  Background:
    Given I am on the login page

  Scenario: Successful login routes to home page
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the home page

  Scenario: User does not exist and can register
    When I enter credentials for a non-existent user
    And I click the login button
    Then I should see an error message "User does not exist"
    And I should see an option to register
    When I click the register option
    Then I should be redirected to the registration page