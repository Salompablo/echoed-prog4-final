import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateAccountModal } from './deactivate-account-modal';

describe('DeactivateAccountModal', () => {
  let component: DeactivateAccountModal;
  let fixture: ComponentFixture<DeactivateAccountModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateAccountModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactivateAccountModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
