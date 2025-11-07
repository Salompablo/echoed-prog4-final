import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentList } from './comment-list';

describe('CommentList', () => {
  let component: CommentList;
  let fixture: ComponentFixture<CommentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
