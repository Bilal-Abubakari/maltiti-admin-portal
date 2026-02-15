/**
 * Profile API Service
 * Handles all HTTP calls to Profile & Settings endpoints
 * Based on Swagger API documentation
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ProfileResponseDto, UpdateProfileDto } from '@models/profile.model';
import { IResponse } from '@models/response.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/me`;

  public getProfile(): Observable<IResponse<ProfileResponseDto>> {
    return this.http.get<IResponse<ProfileResponseDto>>(`${this.baseUrl}/profile`);
  }

  public updateProfile(data: UpdateProfileDto): Observable<ProfileResponseDto> {
    return this.http.put<ProfileResponseDto>(`${this.baseUrl}/profile`, data);
  }

  public uploadAvatar(file: File): Observable<IResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<IResponse<string>>(`${this.baseUrl}/profile/avatar`, formData);
  }
}
