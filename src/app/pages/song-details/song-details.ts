import { Component, inject, OnInit } from '@angular/core';
import { SongSearchResponse } from '../../models/music';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SearchService } from '../../services/search';
import { of, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-song-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './song-details.html',
  styleUrl: './song-details.css'
})
export class SongDetails implements OnInit {

  song: SongSearchResponse | null = null;
  isLoading: boolean = true

  private route = inject(ActivatedRoute);
  private searchService = inject(SearchService)

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        const songId = params['spotifyId'];
        this.isLoading = true;

        if (songId) {
          return this.searchService.getSongDetail(songId);
        }
        return of(null);
      })
    ).subscribe({
      next: (data) => {
        this.song = data;
        this.isLoading = false;
      },
      error: (e) => {
        console.error('Error loading song: ', e);
        this.isLoading = false
      }
    })

  }

  formatDuration(ms: number | undefined): string {
        if (ms === undefined || ms === null) {
            return '--:--';
        }
        
        const totalSeconds = Math.floor(ms / 1000);
        
        const minutes = Math.floor(totalSeconds / 60);
        
        const seconds = totalSeconds % 60;
        
        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${minutes}:${formattedSeconds}`;
    }
}