import { Component, inject, OnInit } from '@angular/core';
import { ArtistSearchResponse } from '../../models/music';
import { ActivatedRoute} from '@angular/router';
import { SearchService } from '../../services/search';
import { of, switchMap } from 'rxjs';
import { ArtistAlbumsCarousel } from '../../components/artist-albums-carousel/artist-albums-carousel';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-artist-details',
  imports: [ArtistAlbumsCarousel,LoadingSpinner, TranslateModule],
  templateUrl: './artist-details.html',
  styleUrl: './artist-details.css',
})
export class ArtistDetails implements OnInit {
  artist: ArtistSearchResponse | null = null;
  isLoading: boolean = true;

  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);

  ngOnInit(): void {
    this.route.params.pipe(
        switchMap((params) => {
          const artistId = params['spotifyId'];
          this.isLoading = true;

          if (artistId) {
            return this.searchService.getArtistDetail(artistId);
          }
          return of(null);
        })
      ).subscribe({
        next: (data) => {
          this.artist = data;
          this.isLoading = false;
        },
        error: (e) => {
          console.error('Error loading artist: ', e);
          this.isLoading = false;
        },
      });
  }
}
