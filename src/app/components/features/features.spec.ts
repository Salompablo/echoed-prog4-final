import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Features } from './features';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('Features', () => {
  let component: Features;
  let fixture: ComponentFixture<Features>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Features],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Features);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
