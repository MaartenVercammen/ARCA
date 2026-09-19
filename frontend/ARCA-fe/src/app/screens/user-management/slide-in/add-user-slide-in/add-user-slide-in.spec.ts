import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserSlideIn } from './add-user-slide-in';

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
});
