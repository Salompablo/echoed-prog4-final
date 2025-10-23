import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { UnifiedSearchResponse } from '../../models/search'; 
import { SearchService } from '../../services/search'; 
import { AlbumRequest, ArtistRequest, SongRequest } from '../../models/music'; 

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar {
  private searchService = inject(SearchService);

  searchTerm = signal('');
  searchResults = signal<UnifiedSearchResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(() => { 
        this.isLoading.set(true);
        this.error.set(null);
      }),
      switchMap(term => { 
        if (!term.trim()) { 
          this.isLoading.set(false);
          this.searchResults.set(null);
          return [];
        }
        return this.searchService.unifiedSearch(term, 0, 5).pipe(
          catchError(err => { 
            console.error('Error during search:', err);
            this.error.set('Search failed. Please try again.');
            this.isLoading.set(false);
            this.searchResults.set(null);
            return [];
          })
        );
      })
    ).subscribe(results => { 
      this.searchResults.set(results as UnifiedSearchResponse);
      this.isLoading.set(false);
    });
  }

  /**
   * Updates searchTerm signal and triggers the search subject on input change.
   * @param event The input event object from the input element.
   */
  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.searchSubject.next(term); 
  }

  /**
   * Clears the search input, results, and resets state.
   * Called when the clear ('X') button is clicked.
   */
  clearSearch(): void {
    this.searchTerm.set('');
    this.searchResults.set(null);
    this.error.set(null);
    this.isLoading.set(false);
    this.searchSubject.next(''); 
  }

  /**
   * Handles clicks on result items, logs selection, and clears search.
   * Replace console.log with actual navigation logic.
   * @param item The selected SongRequest, AlbumRequest, or ArtistRequest object.
   * @param type A string literal ('song', 'album', 'artist') indicating the item type.
   */
  selectItem(item: SongRequest | AlbumRequest | ArtistRequest, type: 'song' | 'album' | 'artist'): void {
    let itemName: string;
    if ('title' in item) { 
      itemName = item.title;
    } else { 
      itemName = item.name;
    }
    this.clearSearch(); 
  }
}