import { TestBed } from '@angular/core/testing';

import { Reaction } from './reaction';

describe('Reaction', () => {
  let service: Reaction;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Reaction);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
