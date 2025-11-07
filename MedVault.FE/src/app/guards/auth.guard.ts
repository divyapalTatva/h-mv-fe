import { CanActivateFn } from "@angular/router";
import { UserRole } from "../shared/enums/common-enum";
import { TokenService } from "../services/common/token.service";
import { inject } from "@angular/core";

export function authGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (): boolean => {
    const tokenService = inject(TokenService);

    if (!tokenService.isLoggedIn()) {
      tokenService.logout();
      return false;
    }

    const userRole = tokenService.getUserRoleFromToken();
    if (!userRole || !allowedRoles.includes(userRole)) {
      tokenService.logout();
      return false;
    }

    return true;
  };
}