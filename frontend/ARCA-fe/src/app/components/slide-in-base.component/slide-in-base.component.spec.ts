import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideInBaseComponent } from './slide-in-base.component';
import { SlideInFooterDirective } from './slide-in-footer.directive';
import { SlideInControllerService } from '../../services/slide-in-controller/slide-in-controller.service';

@Component({
  imports: [SlideInBaseComponent, SlideInFooterDirective],
  template: `
    <app-slide-in-base title="Test title">
      <p class="body-content">Body content</p>
      <button slideInFooter class="footer-content">Footer content</button>
    </app-slide-in-base>
  `,
})
class TestHostComponent {}

describe('SlideInBaseComponent', () => {
  let component: SlideInBaseComponent;
  let fixture: ComponentFixture<SlideInBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideInBaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlideInBaseComponent);
    fixture.componentRef.setInput('title', 'Test title');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should project body and footer content into separate regions', async () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    await hostFixture.whenStable();

    const element = hostFixture.nativeElement as HTMLElement;
    const body = element.querySelector('.slide-in-body');
    const footer = element.querySelector('.slide-in-footer');

    expect(element.querySelector('.slide-in-header h2')?.textContent).toContain('Test title');
    expect(body?.textContent).toContain('Body content');
    expect(body?.textContent).not.toContain('Footer content');
    expect(footer?.textContent).toContain('Footer content');
    expect(footer?.querySelector('.footer-content')).toBeTruthy();
  });

  it('should close the slide-in from the accessible header button', () => {
    const closeSlideInSpy = vi.spyOn(TestBed.inject(SlideInControllerService), 'closeSlideIn');
    const closeButton = fixture.nativeElement.querySelector(
      '.slide-in-header button',
    ) as HTMLButtonElement;

    expect(closeButton.getAttribute('aria-label')).toBe('Close slide-in');
    expect(closeButton.querySelector('mat-icon')?.textContent).toContain('close');

    closeButton.click();

    expect(closeSlideInSpy).toHaveBeenCalledOnce();
  });
});
