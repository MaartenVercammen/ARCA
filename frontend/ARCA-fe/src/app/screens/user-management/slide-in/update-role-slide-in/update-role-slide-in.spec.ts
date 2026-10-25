import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleSlideIn } from './update-role-slide-in';
import { SlideInControllerService } from '../../../../services/slide-in-controller/slide-in-controller.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { User } from '../../../../interfaces/user-management.interface';

describe('UpdateRoleSlideIn', () => {
  let component: UpdateRoleSlideIn;
  let fixture: ComponentFixture<UpdateRoleSlideIn>;
  let httpTesting: HttpTestingController;
  let authServiceMock: { isAdmin: () => boolean; getRoles: () => string[] };

  beforeEach(async () => {
    authServiceMock = {
      isAdmin: vi.fn().mockReturnValue(false),
      getRoles: vi.fn().mockReturnValue(['ROLE_USER', 'ROLE_EDITOR']),
    };

    await TestBed.configureTestingModule({
      imports: [UpdateRoleSlideIn],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(UpdateRoleSlideIn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch roles when user is admin', async () => {
    authServiceMock.isAdmin = vi.fn().mockReturnValue(true);
    const adminFixture = TestBed.createComponent(UpdateRoleSlideIn);
    const req = httpTesting.expectOne('http://localhost:8080/users/roles');
    expect(req.request.method).toBe('GET');
    req.flush(['ROLE_USER', 'ROLE_EDITOR', 'ROLE_ADMIN']);

    await adminFixture.whenStable();
    expect(adminFixture.componentInstance.activeUsersRoles()).toEqual([
      'ROLE_USER',
      'ROLE_EDITOR',
      'ROLE_ADMIN',
    ]);
  });

  it('should initialize selected roles from selectedUser', async () => {
    const user: User = {
      id: 1,
      username: 'testuser',
      roles: ['ROLE_USER'],
      email: 'test@test.com',
      phoneNumber: '0123456789',
      address: {
        street: 'street',
        houseNumber: '1',
        city: 'city',
        zipCode: '1234',
        country: 'Belgium',
      },
    };
    fixture.componentRef.setInput('selectedUser', user);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.selectedRoles()).toEqual(['ROLE_USER']);
    expect(component.isRoleSelected('ROLE_USER')).toBe(true);
    expect(component.isRoleSelected('ROLE_EDITOR')).toBe(false);
  });

  it('should toggle roles correctly', () => {
    component.selectedRoles.set(['ROLE_USER']);

    component.onRoleChange('ROLE_EDITOR', true);
    expect(component.selectedRoles()).toEqual(['ROLE_USER', 'ROLE_EDITOR']);

    component.onRoleChange('ROLE_USER', false);
    expect(component.selectedRoles()).toEqual(['ROLE_EDITOR']);
  });

  it('should send PUT request to /users/{id}/roles and notify on submit', async () => {
    const slideInController = TestBed.inject(SlideInControllerService);
    const notifySpy = vi.spyOn(slideInController, 'notifySlideInSuccess');
    const closeSpy = vi.spyOn(slideInController, 'closeSlideIn');
    const updatedSpy = vi.fn();
    component.updated.subscribe(updatedSpy);

    const user: User = {
      id: 42,
      username: 'alice',
      roles: ['ROLE_USER'],
      email: 'test@test.com',
      phoneNumber: '0123456789',
      address: {
        street: 'street',
        houseNumber: '1',
        city: 'city',
        zipCode: '1234',
        country: 'Belgium',
      },
    };
    fixture.componentRef.setInput('selectedUser', user);
    fixture.detectChanges();
    await fixture.whenStable();

    component.onRoleChange('ROLE_EDITOR', true);
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { cancelable: true }));

    const req = httpTesting.expectOne('http://localhost:8080/users/42/roles');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ roles: ['ROLE_USER', 'ROLE_EDITOR'] });

    req.flush({ id: 42, username: 'alice', roles: ['ROLE_USER', 'ROLE_EDITOR'] });

    expect(updatedSpy).toHaveBeenCalled();
    expect(notifySpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalled();
  });
});
