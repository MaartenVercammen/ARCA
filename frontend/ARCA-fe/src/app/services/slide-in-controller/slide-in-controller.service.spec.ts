import { TestBed } from '@angular/core/testing';

import { SlideInControllerService } from './slide-in-controller.service';

describe('SlideInControllerService', () => {
  let service: SlideInControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlideInControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
