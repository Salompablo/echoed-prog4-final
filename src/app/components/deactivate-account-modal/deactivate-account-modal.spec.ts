import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateAccountModal } from './deactivate-account-modal';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('DeactivateAccountModal', () => {
  let component: DeactivateAccountModal;
  let fixture: ComponentFixture<DeactivateAccountModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeactivateAccountModal],
      providers: [...provideComponentTestDeps()],
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
