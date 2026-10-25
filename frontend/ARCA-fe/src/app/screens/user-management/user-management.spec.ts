import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UserManagement } from './user-management';
import {
  SlideInCloseResult,
  SlideInControllerService,
} from '../../services/slide-in-controller/slide-in-controller.service';
import { AddUserSlideIn } from './slide-in/add-user-slide-in/add-user-slide-in';
import { User } from '../../interfaces/user-management.interface';
import { Subject } from 'rxjs';

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

  it('should recover from a failed initial request after retrying successfully', async () => {
    const failedFixture = TestBed.createComponent(UserManagement);
    const failedComponent = failedFixture.componentInstance;
    const initialRequest = httpTesting.expectOne('http://localhost:8080/users');

    initialRequest.flush('Request failed', { status: 500, statusText: 'Server Error' });
    await failedFixture.whenStable();
    failedFixture.detectChanges();

    expect(failedComponent.hasError()).toBe(true);
    expect(failedComponent.isLoading()).toBe(false);

    failedFixture.nativeElement.querySelector('[role="alert"] button').click();
    const failedRetry = httpTesting.expectOne('http://localhost:8080/users');
    failedRetry.flush('Request failed again', { status: 500, statusText: 'Server Error' });
    await failedFixture.whenStable();
    failedFixture.detectChanges();

    expect(failedComponent.hasError()).toBe(true);
    expect(failedFixture.nativeElement.querySelector('[role="alert"] button')).toBeTruthy();

    failedFixture.nativeElement.querySelector('[role="alert"] button').click();
    const successfulRetry = httpTesting.expectOne('http://localhost:8080/users');
    successfulRetry.flush([
      {
        id: 4,
        username: 'user',
        email: 'user@example.com',
        phoneNumber: '123',
        address: {
          street: 'Main Street',
          houseNumber: '1',
          city: 'Springfield',
          zipCode: '12345',
          country: 'US',
        },
        roles: [],
      },
    ]);
    await failedFixture.whenStable();
    failedFixture.detectChanges();

    expect(failedComponent.hasError()).toBe(false);
    expect(failedComponent.users()).toHaveLength(1);
    expect(failedFixture.nativeElement.querySelector('table')).toBeTruthy();
    failedFixture.destroy();
  });

  it('should reload users after the opened slide-in closes successfully', () => {
    const lifecycle$ = new Subject<SlideInCloseResult>();
    const controller = TestBed.inject(SlideInControllerService);
    vi.spyOn(controller, 'openSlideIn').mockReturnValue(lifecycle$.asObservable());

    (component as any).openAddUserSlideIn();
    lifecycle$.next({ reason: 'success' });

    const request = httpTesting.expectOne('http://localhost:8080/users');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('should not reload users after a manual slide-in close', () => {
    const lifecycle$ = new Subject<SlideInCloseResult>();
    const controller = TestBed.inject(SlideInControllerService);
    vi.spyOn(controller, 'openSlideIn').mockReturnValue(lifecycle$.asObservable());

    (component as any).openAddUserSlideIn();
    lifecycle$.next({ reason: 'close' });

    httpTesting.expectNone('http://localhost:8080/users');
  });

  it('should expose the actions column and open the edit slide-in for a user', () => {
    const user: User = {
      id: 4,
      username: 'user',
      email: '',
      phoneNumber: '',
      address: null,
      roles: [],
    };
    const openSlideInSpy = vi.spyOn(TestBed.inject(SlideInControllerService), 'openSlideIn');
    openSlideInSpy.mockReturnValue(new Subject<SlideInCloseResult>().asObservable());

    expect((component as any).displayedColumns).toContain('actions');
    (component as any).openEditUserSlideIn(user);

    expect(openSlideInSpy).toHaveBeenCalledWith(AddUserSlideIn, { selectedUser: user });
  });
});
