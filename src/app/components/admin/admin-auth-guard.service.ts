
    import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthUserService } from '../../auth.user.service';
// import { AuthService } from './auth.service';
@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router, private userService: AuthUserService) { }
  canActivate(): boolean {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    const user = JSON.parse(localStorage.getItem('user'));
    const roles = user['roles'];
   if (roles !== 'Admin'){
    this.router.navigate(['home']);
    return false;
   }
   if (roles !== 'Admin'){
    this.router.navigate(['login']);
    return false;
   }
    return true;
  }
}   
    