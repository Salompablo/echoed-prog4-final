import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * @class ApiService
 * @description A centralized service for making HTTP requests to the backend API.
 * It abstracts the HttpClient logic and uses the environment-specific base URL.
 */
@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Performs a GET request to a specified endpoint.
   * @template T The expected response type.
   * @param {string} endpoint The API endpoint to call (e.g., '/users').
   * @returns {Observable<T>} An Observable containing the response data.
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  /**
   * Performs a POST request to a specified endpoint.
   * @template T The expected response type.
   * @param {string} endpoint The API endpoint to call.
   * @param {any} data The data to be sent in the request body.
   * @returns {Observable<T>} An Observable containing the response data.
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Performs a PUT request to a specified endpoint.
   * @template T The expected response type.
   * @param {string} endpoint The API endpoint to call (e.g., '/users/1').
   * @param {any} data The data to be sent in the request body for updating the resource.
   * @returns {Observable<T>} An Observable containing the response data.
   */
  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Performs a PATCH request to a specified endpoint.
   * @template T The expected response type.
   * @param {string} endpoint The API endpoint to call (e.g., '/users/1').
   * @param {any} data The data containing only the fields to be updated.
   * @returns {Observable<T>} An Observable containing the response data.
   */
  patch<T>(endpoint: string, data: any): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data);
  }

  /**
   * Performs a DELETE request to a specified endpoint.
   * @template T The expected response type.
   * @param {string} endpoint The API endpoint to call (e.g., '/reviews/123').
   * @returns {Observable<T>} An Observable containing the response data.
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
