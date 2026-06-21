import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { copisteriaGuard } from './copisteria-guard';

describe('copisteriaGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => copisteriaGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
