import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcaButton } from './arca-button';

describe('ArcaButton', () => {
  let component: ArcaButton;
  let fixture: ComponentFixture<ArcaButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcaButton],
    }).compileComponents();

    fixture = TestBed.createComponent(ArcaButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
