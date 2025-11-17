import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageDropdown } from './language-dropdown';

describe('LanguageDropdown', () => {
  let component: LanguageDropdown;
  let fixture: ComponentFixture<LanguageDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageDropdown]
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
