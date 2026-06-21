import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CopisteriaService } from '@services/copisteria-service';

export const copisteriaGuard: CanActivateFn = (route, state) => {
  const s = inject(CopisteriaService)
  return s.getToken() !== null;
};
