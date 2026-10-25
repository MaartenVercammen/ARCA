import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentType } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

import { SlideInCloseResult, SlideInControllerService } from './slide-in-controller.service';
import { SlideInBaseComponent } from '../../components/slide-in-base.component/slide-in-base.component';

@Component({
  template: '',
})
class TestSlideIn extends SlideInBaseComponent {}

describe('SlideInControllerService', () => {
  let service: SlideInControllerService;
  let backdropClick$: Subject<void>;
  let overlayRef: {
    attach: ReturnType<typeof vi.fn>;
    backdropClick: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    backdropClick$ = new Subject<void>();
    overlayRef = {
      attach: vi.fn().mockReturnValue({ setInput: vi.fn() }),
      backdropClick: vi.fn().mockReturnValue(backdropClick$),
      dispose: vi.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Overlay,
          useValue: {
            create: vi.fn().mockReturnValue(overlayRef),
            position: vi.fn().mockReturnValue({
              global: vi.fn().mockReturnValue({
                right: vi.fn().mockReturnValue({ top: vi.fn() }),
              }),
            }),
            scrollStrategies: { block: vi.fn() },
          },
        },
      ],
    });
    service = TestBed.inject(SlideInControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should accept a component derived from SlideInBaseComponent', () => {
    const component: ComponentType<SlideInBaseComponent> = TestSlideIn;

    expect(component).toBe(TestSlideIn);
  });

  it('should emit and complete a manual close lifecycle once', () => {
    const result: SlideInCloseResult[] = [];
    let completed = false;
    service.openSlideIn(TestSlideIn).subscribe({
      next: (value) => result.push(value),
      complete: () => (completed = true),
    });

    service.closeSlideIn();
    service.closeSlideIn();

    expect(result).toEqual([{ reason: 'manual' }]);
    expect(completed).toBe(true);
    expect(overlayRef.dispose).toHaveBeenCalledOnce();
  });

  it('should emit a success close result after success is notified', () => {
    const result: SlideInCloseResult[] = [];
    service.openSlideIn(TestSlideIn).subscribe((value) => result.push(value));

    service.notifySlideInSuccess();
    service.closeSlideIn();

    expect(result).toEqual([{ reason: 'success' }]);
  });

  it('should close from a backdrop click with a manual result', () => {
    const result: SlideInCloseResult[] = [];
    service.openSlideIn(TestSlideIn).subscribe((value) => result.push(value));

    backdropClick$.next();

    expect(result).toEqual([{ reason: 'manual' }]);
    expect(overlayRef.dispose).toHaveBeenCalledOnce();
  });

  it('should complete the previous lifecycle when replacing an open slide-in', () => {
    const firstResult: SlideInCloseResult[] = [];
    let firstCompleted = false;
    service.openSlideIn(TestSlideIn).subscribe({
      next: (value) => firstResult.push(value),
      complete: () => (firstCompleted = true),
    });

    service.openSlideIn(TestSlideIn);

    expect(firstResult).toEqual([{ reason: 'manual' }]);
    expect(firstCompleted).toBe(true);
    expect(overlayRef.dispose).toHaveBeenCalledOnce();
  });
});
