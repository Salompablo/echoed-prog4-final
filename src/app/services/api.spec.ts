import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { ApiService } from './api';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get should GET baseUrl + endpoint and return the body', () => {
    let result: unknown;
    service.get<{ ok: boolean }>('/ping').subscribe((res) => (result = res));

    const req = httpMock.expectOne(`${environment.apiUrl}/ping`);
    expect(req.request.method).toBe('GET');
    req.flush({ ok: true });

    expect(result).toEqual({ ok: true });
  });

  it('post should POST the data to baseUrl + endpoint', () => {
    service.post('/items', { name: 'a' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/items`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'a' });
    req.flush({});
  });

  it('put should PUT the data to baseUrl + endpoint', () => {
    service.put('/items/1', { name: 'b' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/items/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'b' });
    req.flush({});
  });

  it('patch should PATCH the data to baseUrl + endpoint', () => {
    service.patch('/items/1', { name: 'c' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/items/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ name: 'c' });
    req.flush({});
  });

  it('delete should DELETE baseUrl + endpoint', () => {
    service.delete('/items/1').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/items/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should propagate HTTP errors to the subscriber', () => {
    let status: number | undefined;
    service.get('/boom').subscribe({ error: (err) => (status = err.status) });

    httpMock.expectOne(`${environment.apiUrl}/boom`).flush('fail', {
      status: 500,
      statusText: 'Server Error',
    });

    expect(status).toBe(500);
  });
});
