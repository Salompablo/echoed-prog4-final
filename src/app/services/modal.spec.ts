import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal';
import { AuthService } from './auth';

describe('ModalService', () => {
  let service: ModalService;
  let authStub: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authStub = jasmine.createSpyObj<AuthService>('AuthService', ['logout', 'navigateToLogin']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authStub }],
    });
    service = TestBed.inject(ModalService);
  });

  it('should be created with the modal hidden', () => {
    expect(service).toBeTruthy();
    expect(service.isSessionExpiredModalVisible()).toBeFalse();
  });

  it('showSessionExpiredModal should log out without redirecting and show the modal', () => {
    service.showSessionExpiredModal();

    expect(authStub.logout).toHaveBeenCalledOnceWith(false);
    expect(service.isSessionExpiredModalVisible()).toBeTrue();
  });

  it('showSessionExpiredModal should do nothing if the modal is already visible', () => {
    service.showSessionExpiredModal();
    service.showSessionExpiredModal();

    expect(authStub.logout).toHaveBeenCalledTimes(1);
  });

  it('handleExpiredSessionConfirm should hide the modal and go to login', () => {
    service.showSessionExpiredModal();

    service.handleExpiredSessionConfirm();

    expect(service.isSessionExpiredModalVisible()).toBeFalse();
    expect(authStub.navigateToLogin).toHaveBeenCalledTimes(1);
  });
});
