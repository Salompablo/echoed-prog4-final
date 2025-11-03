import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCarousel } from './review-carousel';

describe('ReviewCarousel', () => {
  let component: ReviewCarousel;
  let fixture: ComponentFixture<ReviewCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
