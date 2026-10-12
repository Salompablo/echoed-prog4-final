import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewList } from './review-list';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ReviewList', () => {
  let component: ReviewList;
  let fixture: ComponentFixture<ReviewList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewList],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
