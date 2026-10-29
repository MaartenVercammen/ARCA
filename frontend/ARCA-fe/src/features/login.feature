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
