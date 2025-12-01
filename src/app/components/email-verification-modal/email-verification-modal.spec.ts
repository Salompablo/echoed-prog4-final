import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationModal } from './email-verification-modal';

describe('EmailVerificationModal', () => {
  let component: EmailVerificationModal;
  let fixture: ComponentFixture<EmailVerificationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVerificationModal]
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
