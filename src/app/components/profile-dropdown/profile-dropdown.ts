import { Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile-dropdown',
  imports: [RouterLink],
  templateUrl: './profile-dropdown.html',
  styleUrl: './profile-dropdown.css',
})
export class ProfileDropdown {
  isDropdownOpen = false;
  private eRef = inject(ElementRef);

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener(`document:click`, [`$event`])
  clickout(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}
