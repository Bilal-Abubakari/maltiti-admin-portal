/**
 * Users API Service - Feature-local service for Users
 * Handles all HTTP calls to the Users endpoints
 * Based on Swagger API documentation
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../models/user.model';
import { IResponse } from '../../../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/users`;
  private readonly authUrl = `${environment.apiUrl}/authentication`;

  /**
   * Get all users
   * GET /users
   */
  public getAllUsers(): Observable<IResponse<User[]>> {
    return this.http.get<IResponse<User[]>>(this.baseUrl);
  }

  /**
   * Get single user by ID
   * GET /users/:id
   */
  public getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update user
   * PATCH /users/:id
   */
  public updateUser(id: string, dto: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}`, dto);
  }

  /**
   * Delete user
   * DELETE /users/:id
   */
  public deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Change user status
   * PATCH /users/:id/status
   */
  public changeUserStatus(id: string, status: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}/status`, { status });
  }

  /**
   * Change user role
   * PATCH /users/:id/role
   */
  public changeUserRole(id: string, role: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/${id}/role`, { role });
  }

  /**
   * Create admin (invite admin)
   * POST /authentication/create-admin
   */
  public createAdmin(dto: { email: string; name: string }): Observable<User> {
    return this.http.post<User>(`${this.authUrl}/create-admin`, dto);
  }
}
