import {
  Component,
  computed,
  Input,
  signal,
  TemplateRef,
  OnInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
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
  @Input({ required: true }) itemTemplate!: TemplateRef<any>;

  @Input() autoPlay: boolean = false;
  @Input() autoPlayInterval: number = 5000;
  @Input() pauseOnHover: boolean = true;

  responsiveItemsVisible = signal(10);
  
  currentIndex = signal(0);
  transitionEnabled = signal(true);
  readonly transitionDuration = 400;

  private intervalId?: any;

  @HostListener('window:resize')
  onResize() {
    this.updateItemsVisible();
  }

  displayItems = computed(() => {
    const visibleCount = this.responsiveItemsVisible();
    if (this.items.length <= visibleCount || !this.autoPlay) {
      return this.items;
    }
    return [...this.items, ...this.items.slice(0, Math.floor(visibleCount))];
  });

  maxIndex = computed(() => {
    const totalItems = this.items.length;
    const visible = Math.floor(this.responsiveItemsVisible());
    return totalItems > visible ? totalItems - visible : 0;
  });

  nextItem(): void {
    const totalItems = this.items.length;
    if (totalItems <= this.responsiveItemsVisible()) return;

    this.transitionEnabled.set(true);

    if (this.autoPlay) {
      this.currentIndex.update((prevIndex) => prevIndex + 1);
      const newIdx = this.currentIndex();
      if (newIdx === totalItems) {
        setTimeout(() => {
          this.transitionEnabled.set(false);
          this.currentIndex.set(0);
          setTimeout(() => this.transitionEnabled.set(true), 50);
        }, this.transitionDuration);
      }
    } else {
      if (this.currentIndex() >= this.maxIndex()) {
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
    if (this.items.length <= this.responsiveItemsVisible()) return;

    this.transitionEnabled.set(true); 

    if (this.currentIndex() === 0) {
      setTimeout(() => {
        this.transitionEnabled.set(false); 
        this.currentIndex.set(this.maxIndex()); 
      }, this.transitionDuration);
    } else {
      this.currentIndex.update((prevIndex) => prevIndex - 1);
    }
  }

  get trackTransform(): string {
    const itemWidthPercentage = 100 / this.responsiveItemsVisible();
    const offset = -this.currentIndex() * itemWidthPercentage;
    return `translateX(${offset}%)`;
  }

  ngOnInit(): void {
    this.updateItemsVisible();
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  private updateItemsVisible() {
    const width = window.innerWidth;
    if (width < 500) this.responsiveItemsVisible.set(2.4);
    else if (width < 768) this.responsiveItemsVisible.set(3);
    else if (width < 1024) this.responsiveItemsVisible.set(4);
    else if (width < 1200) this.responsiveItemsVisible.set(6);
    else this.responsiveItemsVisible.set(10);
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    if (this.items.length <= this.responsiveItemsVisible()) return;

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
    if (this.pauseOnHover && this.autoPlay) this.stopAutoPlay();
  }

  resumeAutoPlay(): void {
    if (this.pauseOnHover && this.autoPlay) this.startAutoPlay();
  }
}