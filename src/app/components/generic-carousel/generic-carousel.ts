import { Component, computed, Input, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-generic-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-carousel.html',
  styleUrls: ['./generic-carousel.css'],
})
export class GenericCarouselComponent {

  @Input() title: string = 'Carousel';
  @Input() items: any[] = [];
  @Input() itemsVisible: number = 10;
  @Input({ required: true }) itemTemplate!: TemplateRef<any>;

  currentIndex = signal(0);
  transitionEnabled = signal(true);
  readonly transitionDuration = 400;

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

    if (currentIdx >= maxIdx) {
      setTimeout(() => {
        this.transitionEnabled.set(false); 
        this.currentIndex.set(0); 
      }, this.transitionDuration);
    } else {
      this.currentIndex.update((prevIndex) => prevIndex + 1);
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
}