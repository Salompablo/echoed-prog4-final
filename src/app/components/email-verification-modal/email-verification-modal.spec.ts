import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationModal } from './email-verification-modal';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('EmailVerificationModal', () => {
  let component: EmailVerificationModal;
  let fixture: ComponentFixture<EmailVerificationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationModal],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerificationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
