import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistAlbumsCarousel } from './artist-albums-carousel';
import { Album } from '../../models/music';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ArtistAlbumsCarousel', () => {
  let component: ArtistAlbumsCarousel;
  let fixture: ComponentFixture<ArtistAlbumsCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistAlbumsCarousel],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistAlbumsCarousel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('albums', [
      {
        albumId: 1,
        spotifyId: 'sp1',
        title: 'Album 1',
        artistName: 'Artist',
        releaseDate: '2020-01-01',
      } satisfies Album,
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
