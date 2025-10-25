import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDetails } from './artist-details';

describe('ArtistDetails', () => {
  let component: ArtistDetails;
  let fixture: ComponentFixture<ArtistDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
