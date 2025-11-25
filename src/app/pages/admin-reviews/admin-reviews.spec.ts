import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReviews } from './admin-reviews';

describe('AdminReviews', () => {
  let component: AdminReviews;
  let fixture: ComponentFixture<AdminReviews>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReviews]
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
