import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCard } from './comment-card';

describe('CommentCard', () => {
  let component: CommentCard;
  let fixture: ComponentFixture<CommentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
