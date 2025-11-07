import { AuthService } from './auth';
import { inject, Injectable } from '@angular/core';
import { ApiService } from './api';
import { ReactedType, ReactionResponse, ReactionType } from '../models/interaction';
import { Observable, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
  private api = inject(ApiService);
  private authService = inject(AuthService);

  /**
   * Adds a new reaction to a review or comment.
   * This corresponds to the backend POST endpoints for reactions.
   * @param reactedType The type of content being reacted to (REVIEW or COMMENT).
   * @param parentId The ID of the review or comment.
   * @param reactionType The type of reaction (LIKE, LOVE, etc.).
   * @returns Observable containing the newly created Reaction.
   */
  addReaction(
    reactedType: ReactedType,
    parentId: number,
    reactionType: ReactionType
  ): Observable<ReactionResponse> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const userId = currentUser.userId;
    const params = new URLSearchParams({
      reactionType: reactionType,
      userId: userId.toString(),
    });

    let endpoint: string;
    if (reactedType === ReactedType.REVIEW) {
      endpoint = API_ENDPOINTS.REACTIONS.ADD_TO_REVIEW(parentId);
    } else {
      endpoint = API_ENDPOINTS.REACTIONS.ADD_TO_COMMENT(parentId);
    }

    return this.api.post<ReactionResponse>(`${endpoint}?${params.toString()}`, {});
  }

  /**
   * Updates an existing reaction's type.
   * This corresponds to the backend PATCH /reactions/{reactionId} endpoint.
   * @param reactionId The ID of the reaction to update.
   * @param newReactionType The new reaction type to set.
   * @returns Observable with the updated Reaction object.
   */
  updateReaction(reactionId: number, newReactionType: ReactionType): Observable<ReactionResponse> {
    const params = new URLSearchParams({ newReactionType });
    const endpoint = API_ENDPOINTS.REACTIONS.UPDATE(reactionId);

    return this.api.patch<ReactionResponse>(`${endpoint}?${params.toString()}`, {});
  }

  /**
   * Deletes a reaction.
   * This corresponds to the backend DELETE endpoints for reactions.
   * @param reactedType The type of content the reaction is on ('review' or 'comment').
   * @param parentId The ID of the parent review or comment.
   * @param reactionId The ID of the reaction to delete.
   * @returns Observable<void> that completes on successful deletion (backend returns 204 No Content).
   */
  deleteReaction(reactedType: ReactedType, parentId: number, reactionId: number): Observable<void> {
    const typeString = reactedType === ReactedType.REVIEW ? 'review' : 'comment';

    const endpoint = API_ENDPOINTS.REACTIONS.DELETE(typeString, parentId, reactionId);

    return this.api.delete<void>(endpoint);
  }
}
