import { TestBed, inject } from '@angular/core/testing';

import { BPAuthService } from './auth.service';

describe('Auth.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BPAuthService]
    });
  });

  it('should be created', inject([BPAuthService], (service: BPAuthService) => {
    expect(service).toBeTruthy();
  }));
});
