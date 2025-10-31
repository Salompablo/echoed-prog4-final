import { Component, inject, OnInit, signal } from '@angular/core';
import { SearchService } from '../../services/search';
import { ErrorService } from '../../services/error';
import { AlbumSearchResponse } from '../../models/music';
import { GenericCarouselComponent } from '../generic-carousel/generic-carousel';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-album-carousel',
  imports: [GenericCarouselComponent, RouterLink,CommonModule],
  templateUrl: './album-carousel.html',
  styleUrl: './album-carousel.css',
})
export class AlbumCarousel implements OnInit {
  private searchService = inject(SearchService);
  private errorService = inject(ErrorService);

  mostReviewedAlbums = signal<AlbumSearchResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMostReviewedAlbums();
  }

  loadMostReviewedAlbums() {
    this.isLoading.set(true);
    this.error.set(null);
    this.searchService.getMostReviewedAlbums(15).subscribe({
      next: (response) => {
        this.mostReviewedAlbums.set(response.content);
        this.isLoading.set(false);
      },
      error: (err) => {
        const friendlyErrorMessage = this.errorService.getErrorMessage(err);
        this.error.set(friendlyErrorMessage);
        this.errorService.logError(err, 'AlbumCarousel - loadMostReviewedAlbums');
        this.isLoading.set(false);
      },
    });
  }
}
