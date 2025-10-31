import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongCarousel } from './song-carousel';

describe('SongCarousel', () => {
  let component: SongCarousel;
  let fixture: ComponentFixture<SongCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SongCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
