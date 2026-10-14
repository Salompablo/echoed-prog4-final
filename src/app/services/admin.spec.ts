import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AdminService } from './admin';
import { environment } from '../../environments/environment';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllReviews should use default pagination and sorting', () => {
    service.getAllReviews().subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/admin/reviews?pageNumber=0&size=10&sort=date&direction=desc`,
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: [] });
  });

  it('getAllReviews should forward custom pagination and sorting', () => {
    service.getAllReviews(2, 5, 'rating', 'asc').subscribe();

    const req = httpMock.expectOne(
      `${environment.apiUrl}/admin/reviews?pageNumber=2&size=5&sort=rating&direction=asc`,
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: [] });
  });

  it('deleteReview should DELETE /admin/review/{id}', () => {
    service.deleteReview(7).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/admin/review/7`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('reActivateReview should PUT an empty body to /admin/review/{id}/reactivate', () => {
    service.reActivateReview(7).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/admin/review/7/reactivate`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush(null);
  });

  it('getDashboardStats should GET /stats/admin/dashboard', () => {
    service.getDashboardStats().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/stats/admin/dashboard`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
