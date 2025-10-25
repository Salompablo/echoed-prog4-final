import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumDetails } from './album-details';

describe('AlbumDetails', () => {
  let component: AlbumDetails;
  let fixture: ComponentFixture<AlbumDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlbumDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
