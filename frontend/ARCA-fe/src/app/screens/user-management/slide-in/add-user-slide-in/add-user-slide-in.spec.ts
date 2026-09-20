import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserSlideIn } from './add-user-slide-in';
import { SlideInControllerService } from '../../../../services/slide-in-controller/slide-in-controller.service';

describe('AddUserSlideIn', () => {
  let component: AddUserSlideIn;
  let fixture: ComponentFixture<AddUserSlideIn>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserSlideIn],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AddUserSlideIn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all fields and the shared header/footer actions', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('app-slide-in-base')).toBeTruthy();
    expect(element.querySelectorAll('input').length).toBe(9);
    expect(element.textContent).toContain('Address (optional)');
    expect(element.querySelector('.slide-in-header button')?.getAttribute('aria-label')).toBe(
      'Close slide-in',
    );
    expect(element.querySelector('.slide-in-footer button')?.textContent).toContain('Cancel');
    expect(element.querySelector('.slide-in-footer button:last-child')?.textContent).toContain(
      'Create',
    );
  });

  it('should show required and minimum password validation errors', () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Username is required');
    expect(fixture.nativeElement.textContent).toContain('Password is required');

    component.model.update((model) => ({ ...model, password: 'short' }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Password must be at least 8 characters');
    expect(component.form().invalid()).toBe(true);
  });

  it('should omit blank optional values from the request', () => {
    component.model.update((model) => ({ ...model, username: 'new-user', password: 'password' }));
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector('.slide-in-footer button:last-child') as HTMLButtonElement
    ).click();

    const request = httpTesting.expectOne('http://localhost:8080/users');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ username: 'new-user', password: 'password' });
    request.flush({});
  });

  it('should submit optional contact and address values and close on success', () => {
    const closeSlideInSpy = vi.spyOn(TestBed.inject(SlideInControllerService), 'closeSlideIn');
    const createdSpy = vi.fn();
    component.created.subscribe(createdSpy);
    component.model.set({
      username: 'new-user',
      password: 'password',
      email: 'new-user@example.com',
      phoneNumber: '+123456789',
      address: {
        street: 'Main Street',
        houseNumber: '1',
        city: 'Springfield',
        zipCode: '12345',
        country: 'Wonderland',
      },
    });
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector('.slide-in-footer button:last-child') as HTMLButtonElement
    ).click();

    const request = httpTesting.expectOne('http://localhost:8080/users');
    expect(request.request.body).toEqual({
      username: 'new-user',
      password: 'password',
      email: 'new-user@example.com',
      phoneNumber: '+123456789',
      address: {
        street: 'Main Street',
        houseNumber: '1',
        city: 'Springfield',
        zipCode: '12345',
        country: 'Wonderland',
      },
    });

    request.flush({});
    expect(createdSpy).toHaveBeenCalledOnce();
    expect(closeSlideInSpy).toHaveBeenCalledOnce();
  });

  it('should keep the form open and re-enable submission after a failed request', () => {
    component.model.update((model) => ({ ...model, username: 'new-user', password: 'password' }));
    fixture.detectChanges();
    (
      fixture.nativeElement.querySelector('.slide-in-footer button:last-child') as HTMLButtonElement
    ).click();

    const request = httpTesting.expectOne('http://localhost:8080/users');
    request.flush({ message: 'Creation failed' }, { status: 400, statusText: 'Bad Request' });

    expect(component.isSubmitting()).toBe(false);
    expect(fixture.nativeElement.querySelector('app-slide-in-base')).toBeTruthy();
  });

  it('should not submit twice while a request is pending', () => {
    component.model.update((model) => ({ ...model, username: 'new-user', password: 'password' }));
    fixture.detectChanges();
    const createButton = fixture.nativeElement.querySelector(
      '.slide-in-footer button:last-child',
    ) as HTMLButtonElement;
    createButton.click();
    createButton.click();

    const requests = httpTesting.match('http://localhost:8080/users');
    expect(requests).toHaveLength(1);
    requests[0].flush({});
  });

  it('should close the slide-in when the header action is clicked', () => {
    const closeSlideInSpy = vi.spyOn(TestBed.inject(SlideInControllerService), 'closeSlideIn');

    (fixture.nativeElement.querySelector('.slide-in-header button') as HTMLButtonElement).click();

    expect(closeSlideInSpy).toHaveBeenCalledOnce();
  });
});
