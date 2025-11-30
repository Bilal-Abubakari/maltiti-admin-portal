import { User } from '../models/user.model';

const AUTH_STORAGE_KEY = 'auth_user';

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
}
