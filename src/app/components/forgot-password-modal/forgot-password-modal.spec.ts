import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordModal } from './forgot-password-modal';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ForgotPasswordModal', () => {
  let component: ForgotPasswordModal;
  let fixture: ComponentFixture<ForgotPasswordModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordModal],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
