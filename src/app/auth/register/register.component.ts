import { Component, OnInit } from '@angular/core';
import { BPAuthService } from '../bp-auth.service';
import { AuthUserService } from '../../auth.user.service';
import { SocialAuthService } from 'angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user: {
    name: {
      first?: string;
      last?: string;
    };
    email?: string;
    password?: string;
  } = { name: {} };
  constructor(
    public snackBar: MatSnackBar,
    private authService: BPAuthService,
    private socialAuthService: SocialAuthService,
    private userService: AuthUserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  public socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }
    this.socialAuthService
      .signIn(socialPlatformProvider)
      .then((userData) => {
        const fullName = userData.name.split(' ');
        const [first, last] = fullName;
        this.user['email'] = userData.email;
        this.user['name']['first'] = first;
        this.user['name']['last'] = last;
        this.user['oauth'] = socialPlatform.toUpperCase();
        this.authService.register(this.user).subscribe(
          ({ user, token }) => {
            this.success();
            return this.userService.setUser({ user, token });
          },
          (err) => {
            this.handleError(err);
          }
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  submit = (form) => {
    this.user = {
      name: {
        first : form.value.first,
        last : form.value.last,
      },
      email : form.value.email,
      password : form.value.password,
    };
      
    this.authService.register(this.user).subscribe(
      ({ user, token }) => {
        this.success();
        return this.userService.setUser({ user, token });
      },
      (err) => {
        this.handleError(err);
      }
    );
  };

  success = () => {
    this.snackBar.open('Registered Successfully', '', {
      duration: 2000,
    }),
      this.router.navigate(['/home']);
  };

  handleError = (err) => {
    this.snackBar.open(err.message, '', {
      duration: 6000,
    });
  };
}
