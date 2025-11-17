import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { GenericCarouselComponent } from '../generic-carousel/generic-carousel';
import { RouterLink } from '@angular/router';
import { Album } from '../../models/music';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-artist-albums-carousel',
  imports: [CommonModule, GenericCarouselComponent, RouterLink, TranslateModule],
  templateUrl: './artist-albums-carousel.html',
  styleUrl: './artist-albums-carousel.css',
})
export class ArtistAlbumsCarousel {
  @Input({required: true}) albums!: Album[]
}
