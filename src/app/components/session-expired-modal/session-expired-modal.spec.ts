import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiredModal } from './session-expired-modal';

describe('SessionExpiredModal', () => {
  let component: SessionExpiredModal;
  let fixture: ComponentFixture<SessionExpiredModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpiredModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionExpiredModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
