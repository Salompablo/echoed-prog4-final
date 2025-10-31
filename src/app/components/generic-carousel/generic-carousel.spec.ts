import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericCarousel } from './generic-carousel';

describe('GenericCarousel', () => {
  let component: GenericCarousel;
  let fixture: ComponentFixture<GenericCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
