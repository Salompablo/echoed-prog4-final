import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordModal } from './forgot-password-modal';

describe('ForgotPasswordModal', () => {
  let component: ForgotPasswordModal;
  let fixture: ComponentFixture<ForgotPasswordModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordModal]
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
