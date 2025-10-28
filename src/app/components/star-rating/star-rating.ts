import { Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-star-rating',
  imports: [],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StarRating),
      multi: true,
    },
  ],
})
export class StarRating implements ControlValueAccessor {
  rating = signal<number>(0);
  hoverRating = signal<number>(0);
  disabled = signal<boolean>(false);

  stars = [1, 2, 3, 4, 5];

  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  onStarClick(starIndex: number, event: MouseEvent): void {
    if (this.disabled()) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const isLeftHalf = clickX < rect.width / 2;

    const newRating = isLeftHalf ? starIndex - 0.5 : starIndex;
    this.rating.set(newRating);
    this.onChange(newRating);
    this.onTouched();
  }

  onStarHover(starIndex: number, event: MouseEvent): void {
    if (this.disabled()) return;

    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const isLeftHalf = hoverX < rect.width / 2;

    this.hoverRating.set(isLeftHalf ? starIndex - 0.5 : starIndex);
  }

  onMouseLeave(): void {
    this.hoverRating.set(0);
  }

  getStarFill(starIndex: number): 'empty' | 'half' | 'full' {
    const activeRating = this.hoverRating() || this.rating();

    if (activeRating >= starIndex) {
      return 'full';
    } else if (activeRating >= starIndex - 0.5) {
      return 'half';
    }
    return 'empty';
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    this.rating.set(value || 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
