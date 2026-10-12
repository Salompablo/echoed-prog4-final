import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDetails } from './artist-details';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ArtistDetails', () => {
  let component: ArtistDetails;
  let fixture: ComponentFixture<ArtistDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistDetails],
      providers: [...provideComponentTestDeps()],
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
