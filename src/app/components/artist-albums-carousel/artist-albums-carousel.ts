import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { GenericCarouselComponent } from '../generic-carousel/generic-carousel';
import { RouterLink } from '@angular/router';
import { Album } from '../../models/music';

@Component({
  selector: 'app-artist-albums-carousel',
  imports: [CommonModule, GenericCarouselComponent, RouterLink],
  templateUrl: './artist-albums-carousel.html',
  styleUrl: './artist-albums-carousel.css',
})
export class ArtistAlbumsCarousel {
  @Input({required: true}) albums!: Album[]
}
