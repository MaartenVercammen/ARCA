import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

import { SystemMessageComponent } from './system-message.component';

describe('SystemMessageComponent', () => {
  let component: SystemMessageComponent;
  let fixture: ComponentFixture<SystemMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemMessageComponent],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: { message: 'Test message', type: 'info' },
        },
        {
          provide: MatSnackBarRef,
          useValue: { dismiss: () => undefined },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemMessageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
