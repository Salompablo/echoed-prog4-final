import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUs } from './about-us';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('AboutUs', () => {
  let component: AboutUs;
  let fixture: ComponentFixture<AboutUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutUs],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
