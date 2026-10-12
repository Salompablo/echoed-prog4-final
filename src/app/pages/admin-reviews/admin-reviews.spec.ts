import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReviews } from './admin-reviews';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('AdminReviews', () => {
  let component: AdminReviews;
  let fixture: ComponentFixture<AdminReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReviews],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReviews);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
