import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { UserService } from './user';
import { environment } from '../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const api = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCurrentUserProfile should GET /users/me', () => {
    service.getCurrentUserProfile().subscribe();

    const req = httpMock.expectOne(`${api}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getUserProfileByUsername should GET /users/username/{username}', () => {
    service.getUserProfileByUsername('pablo').subscribe();

    const req = httpMock.expectOne(`${api}/users/username/pablo`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getUserProfileByUserId should GET /users/{id}', () => {
    service.getUserProfileByUserId(8).subscribe();

    const req = httpMock.expectOne(`${api}/users/8`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('updateUserProfile should PUT the data to /users/{id}', () => {
    service.updateUserProfile(8, { biography: 'hello' }).subscribe();

    const req = httpMock.expectOne(`${api}/users/8`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ biography: 'hello' });
    req.flush({});
  });

  it('deactivateAccount should POST the password to /users/deactivate', () => {
    service.deactivateAccount('secret').subscribe();

    const req = httpMock.expectOne(`${api}/users/deactivate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ password: 'secret' });
    req.flush(null);
  });

  it('reactivateAccount should PUT an empty body to /users/{id}/reactivate', () => {
    service.reactivateAccount(8).subscribe();

    const req = httpMock.expectOne(`${api}/users/8/reactivate`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('banUser should POST to /users/{id}/ban', () => {
    service.banUser(8).subscribe();

    const req = httpMock.expectOne(`${api}/users/8/ban`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('unbanUser should POST to /users/{id}/unban', () => {
    service.unbanUser('8').subscribe();

    const req = httpMock.expectOne(`${api}/users/8/unban`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('changePassword should PUT the request to /users/me/change-password', () => {
    const body = { currentPassword: 'old', newPassword: 'new', confirmPassword: 'new' };

    service.changePassword(body).subscribe();

    const req = httpMock.expectOne(`${api}/users/me/change-password`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(body);
    req.flush(null);
  });

  it('completeProfile should POST the chosen username to /users/complete-profile', () => {
    service.completeProfile('newname').subscribe();

    const req = httpMock.expectOne(`${api}/users/complete-profile`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'newname' });
    req.flush({});
  });

  it('getUserSongReviewsById should GET the user song reviews with default sort "date"', () => {
    service.getUserSongReviewsById(8, 0, 10).subscribe();

    const req = httpMock.expectOne(`${api}/songreviews/user/8?pageNumber=0&size=10&sort=date`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getUserAlbumReviewsById should GET the user album reviews with a custom sort', () => {
    service.getUserAlbumReviewsById(8, 1, 5, 'rating').subscribe();

    const req = httpMock.expectOne(`${api}/albumreviews/user/8?pageNumber=1&size=5&sort=rating`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getAllUsers should use the default query, paging and sorting', () => {
    service.getAllUsers().subscribe();

    const req = httpMock.expectOne(`${api}/users?query=&page=0&size=10&sort=createdAt,desc`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getAllUsers should forward the search query, paging and sorting', () => {
    service.getAllUsers('ana', 2, 20, 'username', 'asc').subscribe();

    httpMock.expectOne(`${api}/users?query=ana&page=2&size=20&sort=username,asc`).flush({});
  });
});
