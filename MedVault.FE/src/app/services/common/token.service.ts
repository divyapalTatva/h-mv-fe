import { inject, Injectable } from '@angular/core';
import { LoginResponse } from '../../interfaces/response/loginresponse';
import { Router } from '@angular/router';
import { UserRole } from '../../shared/enums/common-enum';
import { Navigation } from '../../shared/enums/navigation.enum';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly router = inject(Router);

  private readonly prefix = 'APP_';

  private hashKey(raw: string): string {
    return btoa(this.prefix + raw); // base64 encode for simplicity
  }

  private readonly accessTokenKey = this.hashKey('access_token');

  private getDecodedToken(): any | null {
    const token = this.getAccessToken();
    if (!token) return '';

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  saveTokens(loginResponse: LoginResponse) {
    localStorage.setItem(this.accessTokenKey, loginResponse.accessToken);
  }

  logout() {
    const role = this.getUserRoleFromToken();
    localStorage.removeItem(this.accessTokenKey);
    if (role === UserRole.User) {
      this.router.navigate([Navigation.Login]);
    } else if (role === UserRole.Doctor) {
      this.router.navigate([Navigation.Doctor, Navigation.Login]);
    }
  }

  isTokenExpired(): boolean {
    const expiry = this.getDecodedToken()?.exp;
    if (!expiry) return true;

    // The `exp` field in a JWT is in seconds since the Unix epoch.
    // JavaScript's Date.now() returns milliseconds since the epoch,
    // so we multiply by 1000 to convert `exp` to milliseconds for accurate comparison.
    const expiryDateTime = expiry * 1000;
    return Date.now() > expiryDateTime;
  }

  isProfileFilled(): boolean {
    const value = this.getDecodedToken()?.ipf;
    return value === true || value === 'true';
  }

  getUserRoleFromToken(): UserRole | null {
    const roleValue = this.getDecodedToken()?.role || 0;
    return Number(roleValue);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getUserNameFromToken(): string {
    const decodedToken = this.getDecodedToken();
    const firstName = decodedToken?.unique_name || '';
    const lastName = decodedToken?.family_name || '';

    return `${firstName} ${lastName}`.trim();
  }
}
