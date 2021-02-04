import { TestBed, inject } from '@angular/core/testing';

import { AuthUserService } from './auth.user.service';

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthUserService]
    });
  });

  // it('should be created', inject([UserService], (service: UserService) => {
  //   expect(service).toBeTruthy();
  // }));
});
