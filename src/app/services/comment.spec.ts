import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CommentService } from './comment';
import { AuthService } from './auth';
import { AuthProvider } from '../models/auth';
import { UserProfile } from '../models/user';
import { environment } from '../../environments/environment';

describe('CommentService', () => {
  let service: CommentService;
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
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCommentsForReview should GET song review comments with paging and sorting', () => {
    service.getCommentsForReview(10, 'song', 1, 20).subscribe();

    const req = httpMock.expectOne(
      `${api}/songreviews/10/comments?size=20&pageNumber=1&sort=createdAt&direction=desc`,
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: [] });
  });

  it('getCommentsForReview should use the album endpoint for album reviews', () => {
    service.getCommentsForReview(10, 'album', 0, 5).subscribe();

    httpMock
      .expectOne(`${api}/albumreviews/10/comments?size=5&pageNumber=0&sort=createdAt&direction=desc`)
      .flush({ content: [] });
  });

  it('createComment should POST the text and the current user id to the song review', () => {
    service.createComment(10, 'song', 'nice song').subscribe();

    const req = httpMock.expectOne(`${api}/songreviews/10/comments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ userId: 5, text: 'nice song' });
    req.flush({});
  });

  it('createComment should POST to the album review endpoint for albums', () => {
    service.createComment(10, 'album', 'nice album').subscribe();

    const req = httpMock.expectOne(`${api}/albumreviews/10/comments`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('createComment should throw and not call the API when nobody is logged in', () => {
    currentUser.set(null);

    expect(() => service.createComment(10, 'song', 'hi')).toThrowError('User not logged in');
    httpMock.expectNone(() => true);
  });

  it('updateComment should PATCH the new text to the song comment', () => {
    service.updateComment(10, 3, 'song', 'edited').subscribe();

    const req = httpMock.expectOne(`${api}/songreviews/10/comments/3`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ text: 'edited' });
    req.flush({});
  });

  it('updateComment should PATCH the album comment endpoint for albums', () => {
    service.updateComment(10, 3, 'album', 'edited').subscribe();

    const req = httpMock.expectOne(`${api}/albumreviews/10/comments/3`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('deleteComment should DELETE the song comment', () => {
    service.deleteComment(10, 3, 'song').subscribe();

    const req = httpMock.expectOne(`${api}/songreviews/10/comments/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deleteComment should DELETE the album comment', () => {
    service.deleteComment(10, 3, 'album').subscribe();

    const req = httpMock.expectOne(`${api}/albumreviews/10/comments/3`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
