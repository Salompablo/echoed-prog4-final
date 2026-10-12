import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from './auth';
import { AuthProvider, AuthResponse } from '../models/auth';
import { UserProfile } from '../models/user';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  const USER_KEY = 'current-user';
  const TOKEN_KEY = 'auth-token';
  const REFRESH_TOKEN_KEY = 'auth-refresh-token';
  const api = environment.apiUrl;

  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const authResponse: AuthResponse = {
    token: 'access-token',
    refreshToken: 'refresh-token',
    id: 5,
    username: 'pablo',
    email: 'pablo@mail.com',
    roles: ['ROLE_USER'],
    permissions: ['READ'],
  };

  const storedProfile: UserProfile = {
    userId: 5,
    username: 'pablo',
    active: true,
    email: 'pablo@mail.com',
    provider: AuthProvider.LOCAL,
    biography: 'old bio',
    roles: ['ROLE_USER'],
    permissions: ['READ'],
  };

  // jwtDecode only decodes the payload (no signature check), so a hand-made token is enough.
  const fakeJwt = (payload: object) => `header.${btoa(JSON.stringify(payload))}.signature`;

  const createService = () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
  };

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock?.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created with no user when storage is empty', () => {
    createService();

    expect(service).toBeTruthy();
    expect(service.currentUser()).toBeNull();
  });

  it('should restore the user from localStorage on startup', () => {
    localStorage.setItem(USER_KEY, JSON.stringify(storedProfile));

    createService();

    expect(service.currentUser()).toEqual(storedProfile);
  });

  it('should restore the user from sessionStorage on startup', () => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(storedProfile));

    createService();

    expect(service.currentUser()).toEqual(storedProfile);
  });

  it('getAuthToken and getRefreshToken should read from either storage', () => {
    createService();
    expect(service.getAuthToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();

    sessionStorage.setItem(TOKEN_KEY, 'session-token');
    sessionStorage.setItem(REFRESH_TOKEN_KEY, 'session-refresh');
    expect(service.getAuthToken()).toBe('session-token');
    expect(service.getRefreshToken()).toBe('session-refresh');

    localStorage.setItem(TOKEN_KEY, 'local-token');
    expect(service.getAuthToken()).toBe('local-token');
  });

  it('login should POST the credentials and keep the session in sessionStorage by default', () => {
    createService();
    const credentials = { emailOrUsername: 'pablo', password: 'secret' };

    service.login(credentials).subscribe();

    const req = httpMock.expectOne(`${api}/auth`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(authResponse);

    expect(sessionStorage.getItem(TOKEN_KEY)).toBe('access-token');
    expect(sessionStorage.getItem(REFRESH_TOKEN_KEY)).toBe('refresh-token');
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(service.currentUser()).toEqual({
      userId: 5,
      username: 'pablo',
      email: 'pablo@mail.com',
      active: true,
      provider: AuthProvider.LOCAL,
      roles: ['ROLE_USER'],
      permissions: ['READ'],
    });
  });

  it('login with rememberMe should keep the session in localStorage', () => {
    createService();

    service.login({ emailOrUsername: 'pablo', password: 'secret' }, true).subscribe();
    httpMock.expectOne(`${api}/auth`).flush(authResponse);

    expect(localStorage.getItem(TOKEN_KEY)).toBe('access-token');
    expect(localStorage.getItem(USER_KEY)).not.toBeNull();
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('login should not create a session when the backend rejects the credentials', () => {
    createService();
    let status: number | undefined;

    service
      .login({ emailOrUsername: 'pablo', password: 'wrong' })
      .subscribe({ error: (err) => (status = err.status) });
    httpMock
      .expectOne(`${api}/auth`)
      .flush({ message: 'Bad credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect(status).toBe(401);
    expect(service.currentUser()).toBeNull();
    expect(service.getAuthToken()).toBeNull();
  });

  it('register should POST to /auth/register and start a session', () => {
    createService();
    const signup = { username: 'pablo', email: 'pablo@mail.com', password: 'secret' };

    service.register(signup, true).subscribe();

    const req = httpMock.expectOne(`${api}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(signup);
    req.flush(authResponse);

    expect(localStorage.getItem(TOKEN_KEY)).toBe('access-token');
    expect(service.currentUser()?.username).toBe('pablo');
  });

  it('refreshToken should fail without calling the API when there is no refresh token', () => {
    createService();
    let error: Error | undefined;

    service.refreshToken().subscribe({ error: (err) => (error = err) });

    expect(error?.message).toBe('No refresh token available');
    httpMock.expectNone(() => true);
  });

  it('refreshToken should send the refresh token and keep the same storage type', () => {
    localStorage.setItem(TOKEN_KEY, 'old-token');
    localStorage.setItem(REFRESH_TOKEN_KEY, 'old-refresh');
    createService();

    service.refreshToken().subscribe();

    const req = httpMock.expectOne(`${api}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ refreshToken: 'old-refresh' });
    req.flush({ ...authResponse, token: 'new-token', refreshToken: 'new-refresh' });

    expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token');
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe('new-refresh');
    expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('logout should clear the session and navigate to /login by default', () => {
    localStorage.setItem(USER_KEY, JSON.stringify(storedProfile));
    localStorage.setItem(TOKEN_KEY, 'token');
    localStorage.setItem(REFRESH_TOKEN_KEY, 'refresh');
    createService();

    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem(USER_KEY)).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull();
    expect(router.navigate).toHaveBeenCalledOnceWith(['/login']);
  });

  it('logout(false) should clear the session without navigating', () => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(storedProfile));
    createService();

    service.logout(false);

    expect(service.currentUser()).toBeNull();
    expect(sessionStorage.getItem(USER_KEY)).toBeNull();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('navigateToLogin should navigate to /login', () => {
    createService();

    service.navigateToLogin();

    expect(router.navigate).toHaveBeenCalledOnceWith(['/login']);
  });

  it('setSessionFromOAuth should build a GOOGLE profile from the JWT and persist it', () => {
    createService();
    const token = fakeJwt({
      userId: 9,
      sub: 'googleuser',
      email: 'g@mail.com',
      roles: ['ROLE_USER'],
    });

    service.setSessionFromOAuth(token, 'oauth-refresh');

    expect(service.currentUser()).toEqual({
      userId: 9,
      username: 'googleuser',
      email: 'g@mail.com',
      active: true,
      provider: AuthProvider.GOOGLE,
      roles: ['ROLE_USER'],
      permissions: [],
    });
    expect(localStorage.getItem(TOKEN_KEY)).toBe(token);
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe('oauth-refresh');
  });

  it('setSessionFromOAuth should log an error and keep the user logged out for an invalid token', () => {
    createService();
    const errorSpy = spyOn(console, 'error');

    service.setSessionFromOAuth('not-a-jwt', 'refresh');

    expect(errorSpy).toHaveBeenCalled();
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('updateLocalUser should merge the changes into the stored user and the signal', () => {
    localStorage.setItem(USER_KEY, JSON.stringify(storedProfile));
    createService();

    service.updateLocalUser({ username: 'newname', biography: 'new bio' });

    const expected = { ...storedProfile, username: 'newname', biography: 'new bio' };
    expect(service.currentUser()).toEqual(jasmine.objectContaining(expected));
    expect(JSON.parse(localStorage.getItem(USER_KEY)!)).toEqual(expected);
  });

  it('updateLocalUser should keep existing values for fields that are not provided', () => {
    sessionStorage.setItem(USER_KEY, JSON.stringify(storedProfile));
    createService();

    service.updateLocalUser({ username: 'newname' });

    expect(service.currentUser()?.biography).toBe('old bio');
    expect(JSON.parse(sessionStorage.getItem(USER_KEY)!).username).toBe('newname');
  });

  it('updateLocalUser should do nothing (and warn) when nobody is logged in', () => {
    createService();
    const warnSpy = spyOn(console, 'warn');

    service.updateLocalUser({ username: 'newname' });

    expect(warnSpy).toHaveBeenCalled();
    expect(service.currentUser()).toBeNull();
  });

  it('verifyAccount should POST the verification code to /auth/verify', () => {
    createService();

    service.verifyAccount('123456').subscribe();

    const req = httpMock.expectOne(`${api}/auth/verify`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: '123456' });
    req.flush({});
  });

  it('forgotPassword should POST the email to /auth/forgot-password', () => {
    createService();

    service.forgotPassword('pablo@mail.com').subscribe();

    const req = httpMock.expectOne(`${api}/auth/forgot-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'pablo@mail.com' });
    req.flush({});
  });

  it('resetPassword should POST the token and new password to /auth/reset-password', () => {
    createService();
    const data = { token: 'abc', newPassword: 'new-secret' };

    service.resetPassword(data).subscribe();

    const req = httpMock.expectOne(`${api}/auth/reset-password`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(data);
    req.flush({});
  });

  it('resendVerificationCode should POST the email to /auth/resend-verification', () => {
    createService();

    service.resendVerificationCode('pablo@mail.com').subscribe();

    const req = httpMock.expectOne(`${api}/auth/resend-verification`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'pablo@mail.com' });
    req.flush({});
  });
});
