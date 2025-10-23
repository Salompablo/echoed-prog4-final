import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDropdown } from './profile-dropdown';

describe('ProfileDropdown', () => {
  let component: ProfileDropdown;
  let fixture: ComponentFixture<ProfileDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
