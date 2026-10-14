import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SearchService } from './search';
import { environment } from '../../environments/environment';

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;
  const api = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('unifiedSearch should send query, page 0 and size 5 by default', () => {
    service.unifiedSearch('daft punk').subscribe();

    const req = httpMock.expectOne(`${api}/spotify/unified-search?query=daft+punk&page=0&size=5`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('unifiedSearch should forward custom page and size', () => {
    service.unifiedSearch('queen', 2, 20).subscribe();

    httpMock.expectOne(`${api}/spotify/unified-search?query=queen&page=2&size=20`).flush({});
  });

  it('getSongDetail should GET /spotify/songs/{id}', () => {
    service.getSongDetail('abc').subscribe();

    const req = httpMock.expectOne(`${api}/spotify/songs/abc`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getAlbumDetail should GET /spotify/albums/{id}', () => {
    service.getAlbumDetail('abc').subscribe();

    const req = httpMock.expectOne(`${api}/spotify/albums/abc`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getArtistDetail should GET /spotify/artists/{id}', () => {
    service.getArtistDetail('abc').subscribe();

    const req = httpMock.expectOne(`${api}/spotify/artists/abc`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getMostReviewedSongs should default to size 10 and page 0', () => {
    service.getMostReviewedSongs().subscribe();

    httpMock.expectOne(`${api}/stats/songs/mostReviewed?size=10&pageNumber=0`).flush({});
  });

  it('getMostReviewedAlbums should forward size and page', () => {
    service.getMostReviewedAlbums(3, 1).subscribe();

    httpMock.expectOne(`${api}/stats/albums/mostReviewed?size=3&pageNumber=1`).flush({});
  });
});
