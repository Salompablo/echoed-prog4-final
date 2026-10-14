import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oauth2Callback } from './oauth2-callback';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('Oauth2Callback', () => {
  let component: Oauth2Callback;
  let fixture: ComponentFixture<Oauth2Callback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Oauth2Callback],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Oauth2Callback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
