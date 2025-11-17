import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-avatar-picker-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './avatar-picker-modal.html',
  styleUrl: './avatar-picker-modal.css'
})
export class AvatarPickerModal {
  @Output() close = new EventEmitter<void>();
  @Output() avatarSelected = new EventEmitter<string>();

  public defaultAvatars = signal<string[]>([
    'classic-dog.png',
    'country-horse.png',
    'hiphop-dog.png',
    'lofi-dolphin.png',
    'metal-wolf.png',
    'opera-panda.png',
    'pop-cat.png',
    'pop-dog.png',
    'reggae-dog.png',
    'tango-bird.png',
    'techno-dog.png',
    'trap-bat.png'
  ]);

  selectAvatar(avatarFileName: string): void {
    this.avatarSelected.emit(avatarFileName);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
  
  onCancel(): void {
    this.close.emit();
  }
}