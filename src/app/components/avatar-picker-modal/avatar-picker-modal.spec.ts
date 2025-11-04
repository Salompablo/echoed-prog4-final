import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarPickerModal } from './avatar-picker-modal';

describe('AvatarPickerModal', () => {
  let component: AvatarPickerModal;
  let fixture: ComponentFixture<AvatarPickerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPickerModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarPickerModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
