import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionBar } from './reaction-bar';

describe('ReactionBar', () => {
  let component: ReactionBar;
  let fixture: ComponentFixture<ReactionBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactionBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReactionBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
