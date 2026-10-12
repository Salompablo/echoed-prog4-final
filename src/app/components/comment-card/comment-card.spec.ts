import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentCard } from './comment-card';
import { CommentResponse, CommentType } from '../../models/interaction';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('CommentCard', () => {
  let component: CommentCard;
  let fixture: ComponentFixture<CommentCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentCard],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentCard);
    component = fixture.componentInstance;
    const comment: CommentResponse = {
      commentId: 1,
      reviewId: 10,
      userId: 5,
      username: 'pablo',
      text: 'Great song',
      createdAt: '2026-01-01T00:00:00Z',
      commentType: CommentType.SONG,
      totalLikes: 0,
      totalDislikes: 0,
      totalWows: 0,
      totalLoves: 0,
      userReaction: null,
    };
    fixture.componentRef.setInput('comment', comment);
    fixture.componentRef.setInput('reviewType', 'song');
    fixture.componentRef.setInput('reviewId', 10);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
