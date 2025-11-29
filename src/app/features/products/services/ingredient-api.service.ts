// filepath: c:\Users\BilalAbubakari\Desktop\PROJECTS\maltiti-admin-portal\src\app\features\products\services\ingredient-api.service.ts
/**
 * Ingredient API Service - Feature-local service for Ingredients
 * Handles all HTTP calls to the Ingredients endpoints
 * Based on Swagger API documentation
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Ingredient } from '../../../models/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/ingredients`;

  /**
   * Get all ingredients
   * GET /ingredients
   */
  public getAllIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.baseUrl);
  }
}
