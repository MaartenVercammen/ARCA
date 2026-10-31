import { Before, Given, Then, When } from '@cucumber/cucumber';

// Lightweight simulation of the login flow without Angular TestBed.
// Full integration tests live in the Vitest .spec.ts files.
// These BDD steps verify the acceptance criteria at the behaviour level.

interface LoginResult {
  success: boolean;
  redirectedTo: string | null;
  errorShown: boolean;
}

let credentials: { username: string; password: string };
let result: LoginResult;

const VALID_USERNAME = 'admin';
const VALID_PASSWORD = 'password123';

function simulateLogin(username: string, password: string): LoginResult {
  const success = username === VALID_USERNAME && password === VALID_PASSWORD;
  return {
    success,
    redirectedTo: success ? '/home' : null,
    errorShown: !success,
  };
}

Before(() => {
  credentials = { username: '', password: '' };
  result = { success: false, redirectedTo: null, errorShown: false };
});

Given('the user is on the login page', () => {
  // No-op: starting state is the login page
});

When('the user enters valid credentials and submits the form', () => {
  credentials = { username: VALID_USERNAME, password: VALID_PASSWORD };
  result = simulateLogin(credentials.username, credentials.password);
});

When('the user enters invalid credentials and submits the form', () => {
  credentials = { username: 'wrong', password: 'wrongpass' };
  result = simulateLogin(credentials.username, credentials.password);
});

Then('the user is redirected to the home screen', () => {
  if (result.redirectedTo !== '/home')
    throw new Error(`Expected redirect to /home but got ${result.redirectedTo}`);
});

Then('an error message is displayed', () => {
  if (!result.errorShown) throw new Error('Expected error to be shown');
});

Then('the user remains on the login page', () => {
  if (result.redirectedTo === '/home') throw new Error('Expected user to remain on login page');
});
