import { User } from '@models/user.model';

const AUTH_STORAGE_KEY = 'auth_user';
const TOKEN_STORAGE_KEY = 'auth_token';

export class StorageService {
  public static saveUser(user: User): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  public static getUser(): User | null {
    try {
      const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  }

  public static clearUser(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user from localStorage:', error);
    }
  }

  public static saveToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('Error saving token to localStorage:', error);
    }
  }

  public static getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error reading token from localStorage:', error);
      return null;
    }
  }

  public static clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing token from localStorage:', error);
    }
  }
}
