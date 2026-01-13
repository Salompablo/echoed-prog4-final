import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { UnifiedSearchResponse } from '../../models/search';
import { SearchService } from '../../services/search';
import { AlbumSearchResponse, SongSearchResponse, ArtistSearchResponse } from '../../models/music';
import { Router } from '@angular/router';
import { ErrorService } from '../../services/error';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css'],
})
export class SearchBar {
  private searchService = inject(SearchService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  searchTerm = signal('');
  searchResults = signal<UnifiedSearchResponse | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => {
          this.isLoading.set(true);
          this.error.set(null);
        }),
        switchMap((term) => {
          if (!term.trim()) {
            this.isLoading.set(false);
            this.searchResults.set(null);
            return [];
          }
          return this.searchService.unifiedSearch(term, 0, 5).pipe(
            catchError((err) => {
              const errorMessage = this.errorService.getErrorMessage(err);
              this.errorService.logError(err, 'Search');
              this.error.set(errorMessage);
              this.isLoading.set(false);
              this.searchResults.set(null);
              return [];
            })
          );
        })
      )
      .subscribe((results) => {
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
  clearSearch(event?: Event): void {
    if (event) {
      event.preventDefault(); 
      event.stopPropagation(); 
    }
    this.searchTerm.set('');
    this.searchResults.set(null);
    this.error.set(null);
    this.isLoading.set(false);
    this.searchSubject.next('');
    const inputEl = document.getElementById('searchInput');
    if (inputEl) {
      (inputEl as HTMLInputElement).value = ''; 
      inputEl.focus();
    }
  }

  /**
   * Handles clicks on result items, logs selection, and clears search.
   * @param item The selected SongSearchResponse, AlbumSearchResponse, or ArtistSearchResponse object.
   * @param type A string literal ('songs', 'albums', 'artists') indicating the item type.
   */
  selectItem(
    item: SongSearchResponse | AlbumSearchResponse | ArtistSearchResponse,
    type: 'songs' | 'albums' | 'artists'
  ): void {
    let itemName: string;

    if ('title' in item) {
      itemName = item.title;
    } else {
      itemName = item.name;
    }

    this.router.navigate([`/${type}`, item.spotifyId]);

    this.clearSearch();
  }
}
