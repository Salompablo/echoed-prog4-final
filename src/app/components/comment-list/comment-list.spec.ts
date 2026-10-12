import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentList } from './comment-list';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('CommentList', () => {
  let component: CommentList;
  let fixture: ComponentFixture<CommentList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentList],
      providers: [...provideComponentTestDeps()],
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
