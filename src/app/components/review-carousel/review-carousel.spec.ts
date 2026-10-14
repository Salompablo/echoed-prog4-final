import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCarousel } from './review-carousel';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ReviewCarousel', () => {
  let component: ReviewCarousel;
  let fixture: ComponentFixture<ReviewCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCarousel],
      providers: [...provideComponentTestDeps()],
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
