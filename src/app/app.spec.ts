import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideComponentTestDeps } from '../testing/component-test-providers';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [...provideComponentTestDeps()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the app layout: header, main outlet, footer, modal and toasts', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-header')).not.toBeNull();
    expect(compiled.querySelector('main router-outlet')).not.toBeNull();
    expect(compiled.querySelector('app-footer')).not.toBeNull();
    expect(compiled.querySelector('app-session-expired-modal')).not.toBeNull();
    expect(compiled.querySelector('app-toast-container')).not.toBeNull();
  });
});
