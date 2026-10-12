import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumCarousel } from './album-carousel';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('AlbumCarousel', () => {
  let component: AlbumCarousel;
  let fixture: ComponentFixture<AlbumCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumCarousel],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
