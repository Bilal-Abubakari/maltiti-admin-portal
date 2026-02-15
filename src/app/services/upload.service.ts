/**
 * Upload Service - Handles file uploads across the application
 * Provides centralized upload functionality for images and other files
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private readonly http = inject(HttpClient);

  /**
   * Upload an image file
   * POST /upload/image
   * @param file The image file to upload
   * @returns Observable with upload response containing message and data (URL)
   */
  public uploadImage(file: File): Observable<{ message: string; data: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ message: string; data: string }>(
      `${environment.apiUrl}/upload/image`,
      formData,
    );
  }
}
