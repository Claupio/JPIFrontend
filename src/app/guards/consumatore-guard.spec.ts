import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { consumatoreGuard } from './consumatore-guard';

describe('consumatoreGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => consumatoreGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
