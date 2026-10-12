import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactivateAccountModal } from './reactivate-account-modal';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ReactivateAccountModal', () => {
  let component: ReactivateAccountModal;
  let fixture: ComponentFixture<ReactivateAccountModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactivateAccountModal],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactivateAccountModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
