import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishProfile } from './finish-profile';

describe('FinishProfile', () => {
  let component: FinishProfile;
  let fixture: ComponentFixture<FinishProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
