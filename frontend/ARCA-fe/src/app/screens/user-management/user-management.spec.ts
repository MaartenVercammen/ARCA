import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UserManagement } from './user-management';
import { SlideInControllerService } from '../../services/slide-in-controller/slide-in-controller.service';

describe('UserManagement', () => {
  let component: UserManagement;
  let fixture: ComponentFixture<UserManagement>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagement],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UserManagement);
    component = fixture.componentInstance;
    httpTesting.expectOne('http://localhost:8080/users').flush([]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reload users after a successful add-user notification', () => {
    TestBed.inject(SlideInControllerService).notifySlideInSuccess();

    const request = httpTesting.expectOne('http://localhost:8080/users');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
