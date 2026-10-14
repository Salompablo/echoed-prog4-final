import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ReactionService } from './reaction';
import { AuthService } from './auth';
import { ReactedType, ReactionType } from '../models/interaction';
import { AuthProvider } from '../models/auth';
import { UserProfile } from '../models/user';
import { environment } from '../../environments/environment';

describe('ReactionService', () => {
  let service: ReactionService;
  let httpMock: HttpTestingController;
  const api = environment.apiUrl;

  const user: UserProfile = {
    userId: 5,
    username: 'pablo',
    active: true,
    email: 'pablo@mail.com',
    provider: AuthProvider.LOCAL,
    roles: [],
    permissions: [],
  };
  const currentUser = signal<UserProfile | null>(user);

  beforeEach(() => {
    currentUser.set(user);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { currentUser } },
      ],
    });
    service = TestBed.inject(ReactionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('addReaction should POST to the review reactions endpoint with type and current user', () => {
    service.addReaction(ReactedType.REVIEW, 9, ReactionType.LIKE).subscribe();

    const req = httpMock.expectOne(`${api}/reviews/9/reactions?reactionType=LIKE&userId=5`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('addReaction should POST to the comment reactions endpoint for comments', () => {
    service.addReaction(ReactedType.COMMENT, 3, ReactionType.LOVE).subscribe();

    const req = httpMock.expectOne(`${api}/comments/3/reactions?reactionType=LOVE&userId=5`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('addReaction should fail without calling the API when nobody is logged in', () => {
    currentUser.set(null);
    let error: Error | undefined;

    service.addReaction(ReactedType.REVIEW, 9, ReactionType.LIKE).subscribe({
      error: (err) => (error = err),
    });

    expect(error?.message).toBe('User not authenticated');
    httpMock.expectNone(() => true);
  });

  it('updateReaction should PATCH /reactions/{id} with the new reaction type', () => {
    service.updateReaction(4, ReactionType.WOW).subscribe();

    const req = httpMock.expectOne(`${api}/reactions/4?newReactionType=WOW`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('deleteReaction should DELETE the reaction of a review', () => {
    service.deleteReaction(ReactedType.REVIEW, 9, 4).subscribe();

    const req = httpMock.expectOne(`${api}/reviews/9/reactions/4`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deleteReaction should DELETE the reaction of a comment', () => {
    service.deleteReaction(ReactedType.COMMENT, 3, 4).subscribe();

    const req = httpMock.expectOne(`${api}/comments/3/reactions/4`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
