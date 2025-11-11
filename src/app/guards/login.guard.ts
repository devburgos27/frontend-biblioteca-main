import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) {
        const role = authService.getRole();
        if (role === 'Admin') {
          router.navigate(['/libros']);
        } else {
          router.navigate(['/prestamos']);
        }
        return false;
      }
      return true; 
    })
  );
};