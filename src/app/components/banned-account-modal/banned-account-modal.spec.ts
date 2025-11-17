import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannedAccountModal } from './banned-account-modal';

describe('BannedAccountModal', () => {
  let component: BannedAccountModal;
  let fixture: ComponentFixture<BannedAccountModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannedAccountModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannedAccountModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
