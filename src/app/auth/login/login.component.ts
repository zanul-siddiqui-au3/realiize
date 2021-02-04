import { Component, OnInit } from '@angular/core';
import { BPAuthService } from '../bp-auth.service';
import { AuthUserService } from '../../auth.user.service';
import { SocialAuthService } from 'angularx-social-login';
import {UserService} from '../user-service.service';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialUser,
} from 'angularx-social-login';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    public snackBar: MatSnackBar,
    private authService: BPAuthService,
    private socialAuthService: SocialAuthService,
    private userService: AuthUserService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public dialog: MatDialog,
    private userAuthService : UserService
  ) {}

  ngOnInit() {}

  openDialog(): void {
    const dialogRef = this.dialog.open(ForgotPasswordComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.sendResetPasswordLink(result);
      }
    });
  }

  sendResetPasswordLink(email) {
    if (email) {
      this.userAuthService.sendLink(email).subscribe(
        (result) => {
          this.snackBar.open(
            'Reset Link is sent successfully, Please check your email!',
            '',
            {
              duration: 2000,
            }
          );
        },
        (err) => {
          this.handleError(err);
        }
      );
    }
  }
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
        const newuser = {};
        newuser['email'] = userData.email;

        newuser['oauth'] = socialPlatform.toUpperCase();
        this.authService.login(newuser).subscribe(
          ({ token, user }) => {
            return this.userService.setUser({ user, token }), this.success();
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
    this.authService.login(form.value).subscribe(
      ({ token, user }) => {
        return this.userService.setUser({ user, token }), this.success();
      },
      (err) => {
        this.handleError(err);
      }
    );
  };

  success = () => {
    this.snackBar.open('Logged In', '', {
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
