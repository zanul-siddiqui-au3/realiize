import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from '../auth.user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public user: SocialUser;
  public loggedIn: boolean;
  constructor(
    private router: Router,
    private userService: AuthUserService,
    private authService: SocialAuthService
  ) {}

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
    });
  }

  signOut(): void {
    this.authService.signOut();
    this.userService.unsetUser();
    this.router.navigate(['/login']);
  }
}
