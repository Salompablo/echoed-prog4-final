import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDropdown } from './profile-dropdown';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ProfileDropdown', () => {
  let component: ProfileDropdown;
  let fixture: ComponentFixture<ProfileDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDropdown],
      providers: [...provideComponentTestDeps()],
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
