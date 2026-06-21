import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AdminService } from '@services/admin-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const s = inject(AdminService);
  return s.getToken() !== null;
};
