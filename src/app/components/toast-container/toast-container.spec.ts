import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastContainer } from './toast-container';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ToastContainer', () => {
  let component: ToastContainer;
  let fixture: ComponentFixture<ToastContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastContainer],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
