import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search';
import { ErrorService } from '../../services/error';
import { SongSearchResponse } from '../../models/music';
import { RouterLink } from '@angular/router';
import { GenericCarouselComponent } from '../generic-carousel/generic-carousel';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-song-carousel',
  standalone: true,
  imports: [CommonModule, RouterLink, GenericCarouselComponent,LoadingSpinner, TranslateModule],
  templateUrl: './song-carousel.html',
  styleUrls: ['./song-carousel.css'],
})
export class SongCarousel implements OnInit {
  private searchService = inject(SearchService);
  private errorService = inject(ErrorService);

  mostReviewedSongs = signal<SongSearchResponse[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMostReviewedSongs();
  }

  loadMostReviewedSongs(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.searchService.getMostReviewedSongs(15).subscribe({
      next: (response) => {
        this.mostReviewedSongs.set(response.content);
        this.isLoading.set(false);
      },
      error: (err) => {
        const friendlyErrorMessage = this.errorService.getErrorMessage(err);
        this.error.set(friendlyErrorMessage);
        this.errorService.logError(err, 'SongCarousel - loadMostReviewedSongs');
        this.isLoading.set(false);
      },
    });
  }
}
