import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.perfil$.pipe(
    filter(perfil => perfil !== undefined),
    take(1),
    map(perfil => {
      if (!perfil) return router.createUrlTree(['/login']);
      return perfil.rol === 'Administrador' ? true : router.createUrlTree(['/']);
    })
  );
};
