import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordModal } from './change-password-modal';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('ChangePasswordModal', () => {
  let component: ChangePasswordModal;
  let fixture: ComponentFixture<ChangePasswordModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordModal],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
