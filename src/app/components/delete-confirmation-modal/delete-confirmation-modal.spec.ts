import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfirmationModal } from './delete-confirmation-modal';

describe('DeleteConfirmationModal', () => {
  let component: DeleteConfirmationModal;
  let fixture: ComponentFixture<DeleteConfirmationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
