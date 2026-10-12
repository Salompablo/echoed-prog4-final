import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewCard } from './review-card';
import { SongReviewResponse } from '../../models/interaction';
import { AuthProvider } from '../../models/auth';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ReviewCard', () => {
  let component: ReviewCard;
  let fixture: ComponentFixture<ReviewCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewCard],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewCard);
    component = fixture.componentInstance;
    const review: SongReviewResponse = {
      songReviewId: 1,
      song: {
        songId: 1,
        spotifyId: 'sp1',
        name: 'Song',
        artistName: 'Artist',
        albumName: 'Album',
        explicit: false,
        releaseDate: '2020-01-01',
      },
      rating: 4,
      description: 'Great song',
      date: '2026-01-01T00:00:00Z',
      user: {
        userId: 5,
        username: 'pablo',
        active: true,
        email: 'pablo@mail.com',
        provider: AuthProvider.LOCAL,
        roles: [],
        permissions: [],
      },
      active: true,
      totalLikes: 0,
      totalDislikes: 0,
      totalWows: 0,
      totalLoves: 0,
      userReaction: null,
      totalComments: 0,
    };
    fixture.componentRef.setInput('review', review);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
