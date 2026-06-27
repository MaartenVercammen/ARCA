Feature: Health check
  Check if the application is online

  Scenario: Health check
    Given the application is running
    When I make a call
    Then It should repsoned with "Health"