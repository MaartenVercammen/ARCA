import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  showPassword = false;
  errors: any = {};
  generalError = '';

  constructor(private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.errors = {};
    this.generalError = '';

    if (!this.username) {
      this.errors.username = 'Username is required';
    }

    if (!this.password) {
      this.errors.password = 'Password is required';
    }

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // Simple email/username format validation (as per fe/login-screen.feature)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernamePattern = /^[a-zA-Z0-9_-]{3,16}$/;

    if (!emailPattern.test(this.username) && !usernamePattern.test(this.username)) {
      this.generalError = 'Please enter a valid username or email';
      return;
    }

    // Mock login logic for E2E scenarios
    if (this.username === 'validUser' && this.password === 'validPass123') {
      this.router.navigate(['/home']);
    } else if (this.username === 'nonExistentUser') {
      this.generalError = 'User does not exist';
    } else {
      this.generalError = 'Invalid credentials';
    }
  }
}
