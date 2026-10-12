import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageDropdown } from './language-dropdown';
import { provideComponentTestDeps } from '../../../testing/component-test-providers';

describe('LanguageDropdown', () => {
  let component: LanguageDropdown;
  let fixture: ComponentFixture<LanguageDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageDropdown],
      providers: [...provideComponentTestDeps()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
