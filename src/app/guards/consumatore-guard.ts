import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ConsumatoreService } from '@services/consumatore-service';

export const consumatoreGuard: CanActivateFn = (route, state) => {
  const s = inject(ConsumatoreService)
  return s.getToken() !== null;
};
