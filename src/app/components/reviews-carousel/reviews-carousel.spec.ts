import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsCarousel } from './reviews-carousel';

describe('ReviewsCarousel', () => {
  let component: ReviewsCarousel;
  let fixture: ComponentFixture<ReviewsCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewsCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewsCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
