import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hero } from './hero';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('Hero', () => {
  let component: Hero;
  let fixture: ComponentFixture<Hero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hero],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
