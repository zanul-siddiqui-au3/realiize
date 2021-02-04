import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthUserService } from './auth.user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private authUserService: AuthUserService
  ) {

  }
  ngOnInit() {
    if (this.authUserService.isAuthenticated()) {
      this.authUserService.verifyToken()
        .catch(err => {
          this.authUserService.unsetUser();
          this.router.navigate(['login'])
        })
    }
  }
}
