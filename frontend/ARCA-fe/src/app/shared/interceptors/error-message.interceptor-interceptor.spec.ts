import { TestBed } from '@angular/core/testing';

import { ErrorMessageInterceptor } from './error-message.interceptor';

describe('ErrorMessageInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorMessageInterceptor],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(ErrorMessageInterceptor)).toBeTruthy();
  });
});
