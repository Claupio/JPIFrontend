import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AdminService } from '@services/admin-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const s = inject(AdminService);
  const t = s.getToken()
  return  t !== null && t !== undefined && t !== '';
};
