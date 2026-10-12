import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationModal } from './delete-confirmation-modal';

import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('DeleteConfirmationModal', () => {
  let component: DeleteConfirmationModal;
  let fixture: ComponentFixture<DeleteConfirmationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationModal],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmationModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('target', { type: 'review' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
