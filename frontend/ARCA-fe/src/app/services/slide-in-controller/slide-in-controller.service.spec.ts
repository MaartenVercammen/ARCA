import { TestBed } from '@angular/core/testing';
import { ComponentType } from '@angular/cdk/portal';

import { SlideInControllerService } from './slide-in-controller.service';
import { SlideInBaseComponent } from '../../components/slide-in-base.component/slide-in-base.component';

class TestSlideIn extends SlideInBaseComponent {}

describe('SlideInControllerService', () => {
  let service: SlideInControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlideInControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should accept a component derived from SlideInBaseComponent', () => {
    const component: ComponentType<SlideInBaseComponent> = TestSlideIn;

    expect(component).toBe(TestSlideIn);
  });
});
