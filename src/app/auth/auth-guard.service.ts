import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthUserService } from '../auth.user.service';
// import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: AuthUserService) { }
  canActivate(): boolean {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
