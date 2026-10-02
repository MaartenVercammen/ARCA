import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRoleSlideIn } from './update-role-slide-in';

describe('UpdateRoleSlideIn', () => {
  let component: UpdateRoleSlideIn;
  let fixture: ComponentFixture<UpdateRoleSlideIn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateRoleSlideIn],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateRoleSlideIn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
