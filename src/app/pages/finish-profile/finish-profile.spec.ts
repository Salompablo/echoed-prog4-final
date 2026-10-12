import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishProfile } from './finish-profile';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('FinishProfile', () => {
  let component: FinishProfile;
  let fixture: ComponentFixture<FinishProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishProfile],
      providers: [...provideComponentTestDeps()],
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
