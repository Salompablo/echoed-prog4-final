import { TestBed } from '@angular/core/testing';

import { Search } from './search';

describe('Search', () => {
  let service: Search;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Search);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
