import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { GenericCarouselComponent } from './generic-carousel';

@Component({
  imports: [GenericCarouselComponent],
  template: `
    <ng-template #itemTpl let-item><span class="test-item">{{ item }}</span></ng-template>
    <app-generic-carousel title="Top songs" [items]="items" [itemTemplate]="itemTpl" />
  `,
})
class HostComponent {
  items: string[] = [];
}

describe('GenericCarouselComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let carousel: GenericCarouselComponent;

  const render = (items: string[]) => {
    host.items = items;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    carousel = fixture.debugElement.children[0].componentInstance;
    // Visible items normally depend on the window width; pin it so the tests are deterministic.
    carousel.responsiveItemsVisible.set(3);
  });

  it('should create and show the title', () => {
    expect(carousel).toBeTruthy();
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Top songs');
  });

  it('should show the empty message when there are no items', () => {
    render([]);

    expect(fixture.nativeElement.textContent).toContain('No items to display.');
    expect(fixture.nativeElement.querySelector('.carousel-wrapper')).toBeNull();
  });

  it('should render every item through the item template', () => {
    render(['a', 'b', 'c', 'd', 'e']);

    const rendered = Array.from(fixture.nativeElement.querySelectorAll('.test-item')).map(
      (el) => (el as HTMLElement).textContent,
    );
    expect(rendered).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('should disable the controls when all items fit on screen', () => {
    render(['a', 'b']);

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('.carousel-control'),
    );
    expect(buttons.length).toBe(2);
    expect(buttons.every((b) => b.disabled)).toBeTrue();
  });

  it('nextItem should advance the index until maxIndex', () => {
    render(['a', 'b', 'c', 'd', 'e']);
    expect(carousel.maxIndex()).toBe(2);

    carousel.nextItem();
    carousel.nextItem();

    expect(carousel.currentIndex()).toBe(2);
  });

  it('nextItem at the end should wrap back to the start after the transition', fakeAsync(() => {
    render(['a', 'b', 'c', 'd', 'e']);
    carousel.currentIndex.set(carousel.maxIndex());

    carousel.nextItem();
    tick(carousel.transitionDuration);

    expect(carousel.currentIndex()).toBe(0);
    expect(carousel.transitionEnabled()).toBeFalse();
  }));

  it('previousItem should go back one index', () => {
    render(['a', 'b', 'c', 'd', 'e']);
    carousel.currentIndex.set(2);

    carousel.previousItem();

    expect(carousel.currentIndex()).toBe(1);
  });

  it('previousItem at the start should wrap to the last position after the transition', fakeAsync(() => {
    render(['a', 'b', 'c', 'd', 'e']);

    carousel.previousItem();
    tick(carousel.transitionDuration);

    expect(carousel.currentIndex()).toBe(carousel.maxIndex());
  }));

  it('should not move when all items fit on screen', () => {
    render(['a', 'b']);

    carousel.nextItem();
    carousel.previousItem();

    expect(carousel.currentIndex()).toBe(0);
  });

  it('trackTransform should translate by the index times the item width', () => {
    carousel.currentIndex.set(2);

    // 3 visible items -> each one takes 100/3 % of the viewport
    expect(carousel.trackTransform).toBe(`translateX(${-2 * (100 / 3)}%)`);
  });

  it('should auto-advance when autoPlay is on and stop on destroy', fakeAsync(() => {
    render(['a', 'b', 'c', 'd', 'e']);
    carousel.autoPlay = true;
    carousel.autoPlayInterval = 1000;

    carousel.startAutoPlay();
    tick(1000);
    expect(carousel.currentIndex()).toBe(1);

    carousel.ngOnDestroy();
    tick(5000);
    expect(carousel.currentIndex()).toBe(1);
  }));
});
