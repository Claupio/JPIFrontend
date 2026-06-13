import { TestBed } from '@angular/core/testing';

import { CopisteriaService } from './copisteria-service';

describe('CopisteriaService', () => {
  let service: CopisteriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CopisteriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
