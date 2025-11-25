import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; //
import { ToastService } from '../services/toast'; //

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router);
  const toastService = inject(ToastService); 

  const currentUser = authService.currentUser(); 

  if (!currentUser) {
    router.navigate(['/login']); 
    return false;
  }

  const isAdmin = currentUser.roles.includes('ROLE_ADMIN'); 

  if (isAdmin) {
    return true; 
  } else {
    toastService.error("Access denied. You must be an administrator."); 
    router.navigate(['/']); 
    return false;
  }
};