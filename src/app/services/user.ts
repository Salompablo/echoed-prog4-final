import { inject, Injectable } from '@angular/core';
import { Api } from './api';
import { Observable } from 'rxjs';
import { FullUserProfile } from '../models/user';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class User {
  private apiService = inject(Api);

  /**
   * Fetches the profile for the currently logged-in user.
   */
  getCurrentUserProfile(): Observable<FullUserProfile> {
    return this.apiService.get<FullUserProfile>(API_ENDPOINTS.USERS.ME);
  }

  /**
   * Fetches a user profile by username.
   */
  getUserProfileByUsername(username: string): Observable<FullUserProfile> {
    return this.apiService.get<FullUserProfile>(API_ENDPOINTS.USERS.BY_USERNAME(username))
  }
}
