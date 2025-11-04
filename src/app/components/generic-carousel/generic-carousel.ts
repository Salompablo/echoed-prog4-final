import { Component, computed, Input, signal, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-carousel.html',
  styleUrls: ['./generic-carousel.css'],
})
export class GenericCarouselComponent implements OnInit, OnDestroy {

  @Input() title: string = 'Carousel';
  @Input() items: any[] = [];
  @Input() itemsVisible: number = 10;
  @Input({ required: true }) itemTemplate!: TemplateRef<any>;

  // Auto-play configuration
  @Input() autoPlay: boolean = false;
  @Input() autoPlayInterval: number = 5000; // milliseconds
  @Input() pauseOnHover: boolean = true;

  currentIndex = signal(0);
  transitionEnabled = signal(true);
  readonly transitionDuration = 400;

  private intervalId?: any;

  displayItems = computed(() => {
    if (this.items.length <= this.itemsVisible || !this.autoPlay) {
      return this.items;
    }
    // duplicate the first itemsVisible items at the end for seamless loop
    return [...this.items, ...this.items.slice(0, this.itemsVisible)];
  });

  maxIndex = computed(() => {
    const totalItems = this.items.length;
    return totalItems > this.itemsVisible ? totalItems - this.itemsVisible : 0;
  });

  nextItem(): void {
    const currentIdx = this.currentIndex();
    const maxIdx = this.maxIndex();
    const totalItems = this.items.length;

    if (totalItems <= this.itemsVisible) return;

    this.transitionEnabled.set(true);

    if (this.autoPlay) {
      this.currentIndex.update((prevIndex) => prevIndex + 1);

      // check if we reached the duplicated section
      const newIdx = this.currentIndex();
      if (newIdx === totalItems) {
        // duplicated section, jump back to start after transition
        setTimeout(() => {
          this.transitionEnabled.set(false);
          this.currentIndex.set(0);

          // re-enable transition for next slide
          setTimeout(() => {
            this.transitionEnabled.set(true);
          }, 50);
        }, this.transitionDuration);
      }
    } else {
      // Manual navigation
      if (currentIdx >= maxIdx) {
        setTimeout(() => {
          this.transitionEnabled.set(false);
          this.currentIndex.set(0);
        }, this.transitionDuration);
      } else {
        this.currentIndex.update((prevIndex) => prevIndex + 1);
      }
    }
  }

  previousItem(): void {
    const currentIdx = this.currentIndex();
    const maxIdx = this.maxIndex();
    const totalItems = this.items.length;

    if (totalItems <= this.itemsVisible) return;

    this.transitionEnabled.set(true); 

    if (currentIdx === 0) {
      setTimeout(() => {
        this.transitionEnabled.set(false); 
        this.currentIndex.set(maxIdx); 
      }, this.transitionDuration);
    } else {
      this.currentIndex.update((prevIndex) => prevIndex - 1);
    }
  }

  get trackTransform(): string {
    const itemWidthPercentage = 100 / this.itemsVisible;
    const offset = -this.currentIndex() * itemWidthPercentage;
    return `translateX(${offset}%)`;
  }

  ngOnInit(): void {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    if (this.items.length <= this.itemsVisible) return;

    this.intervalId = setInterval(() => {
      this.nextItem();
    }, this.autoPlayInterval);
  }

  stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  pauseAutoPlay(): void {
    if (this.pauseOnHover && this.autoPlay) {
      this.stopAutoPlay();
    }
  }

  resumeAutoPlay(): void {
    if (this.pauseOnHover && this.autoPlay) {
      this.startAutoPlay();
    }
  }
}