import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfile } from './user-profile';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
