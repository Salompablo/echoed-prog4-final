import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongCarousel } from './song-carousel';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('SongCarousel', () => {
  let component: SongCarousel;
  let fixture: ComponentFixture<SongCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongCarousel],
      providers: [...provideComponentTestDeps()],
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
