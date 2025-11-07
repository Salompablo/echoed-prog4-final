import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentModal } from './comment-modal';

describe('CommentModal', () => {
  let component: CommentModal;
  let fixture: ComponentFixture<CommentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
