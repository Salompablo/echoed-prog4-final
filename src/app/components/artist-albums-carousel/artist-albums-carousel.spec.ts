import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistAlbumsCarousel } from './artist-albums-carousel';

describe('ArtistAlbumsCarousel', () => {
  let component: ArtistAlbumsCarousel;
  let fixture: ComponentFixture<ArtistAlbumsCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistAlbumsCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistAlbumsCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
