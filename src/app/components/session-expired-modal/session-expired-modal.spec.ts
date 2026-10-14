import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpiredModal } from './session-expired-modal';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('SessionExpiredModal', () => {
  let component: SessionExpiredModal;
  let fixture: ComponentFixture<SessionExpiredModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpiredModal],
      providers: [...provideComponentTestDeps()],
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
