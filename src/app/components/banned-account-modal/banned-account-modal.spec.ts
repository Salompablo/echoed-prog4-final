import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannedAccountModal } from './banned-account-modal';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('BannedAccountModal', () => {
  let component: BannedAccountModal;
  let fixture: ComponentFixture<BannedAccountModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannedAccountModal],
      providers: [...provideComponentTestDeps()],
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
