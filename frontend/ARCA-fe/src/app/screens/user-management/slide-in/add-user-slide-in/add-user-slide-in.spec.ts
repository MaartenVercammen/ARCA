import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserSlideIn } from './add-user-slide-in';
import { SlideInControllerService } from '../../../../services/slide-in-controller/slide-in-controller.service';

describe('AddUserSlideIn', () => {
  let component: AddUserSlideIn;
  let fixture: ComponentFixture<AddUserSlideIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserSlideIn],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserSlideIn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the base shell and shared header close action', () => {
    const element = fixture.nativeElement as HTMLElement;
    const closeButton = element.querySelector('.slide-in-header button');

    expect(element.querySelector('app-slide-in-base')).toBeTruthy();
    expect(element.querySelector('.slide-in-body')?.textContent).toContain('Add user content');
    expect(closeButton?.getAttribute('aria-label')).toBe('Close slide-in');
    expect(element.querySelector('.slide-in-footer button')).toBeNull();
  });

  it('should close the slide-in when the header action is clicked', () => {
    const closeSlideInSpy = vi.spyOn(TestBed.inject(SlideInControllerService), 'closeSlideIn');

    fixture.nativeElement.querySelector('.slide-in-header button').click();

    expect(closeSlideInSpy).toHaveBeenCalledOnce();
  });
});
