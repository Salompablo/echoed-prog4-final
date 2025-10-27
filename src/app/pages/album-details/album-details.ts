import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AlbumSearchResponse } from '../../models/music';
import { SearchService } from '../../services/search';
import { of, switchMap } from 'rxjs';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-album-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './album-details.html',
  styleUrl: './album-details.css',
})
export class AlbumDetails implements OnInit {
  album: AlbumSearchResponse | null = null;
  isLoading: boolean = true;

  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService);

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap((params) => {
          const albumId = params['spotifyId'];
          this.isLoading = true;

          if (albumId) {
            return this.searchService.getAlbumDetail(albumId);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (data) => {
          this.album = data;
          this.isLoading = false;
        },
        error: (e) => {
          console.error('Error loading album: ', e);
          this.isLoading = false;
        },
      })
  }
}
