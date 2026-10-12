import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongDetails } from './song-details';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('SongDetails', () => {
  let component: SongDetails;
  let fixture: ComponentFixture<SongDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongDetails],
      providers: [...provideComponentTestDeps()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(SongDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
