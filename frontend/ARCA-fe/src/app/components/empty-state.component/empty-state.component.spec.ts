import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the empty state message and emit retry', () => {
    const retrySpy = vi.spyOn(component.retry, 'emit');

    fixture.nativeElement.querySelector('button').click();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('No data found');
    expect(retrySpy).toHaveBeenCalledOnce();
  });
});
