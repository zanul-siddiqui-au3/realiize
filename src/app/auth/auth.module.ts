import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';
// Services
import {UserService} from './user-service.service';
import { BPAuthService } from './bp-auth.service';
import { HomeComponent } from '../home/home.component';
import { AuthGuard } from './auth-guard.service';
import { environment } from '../../environments/environment';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UnsubscribeComponent } from './unsubscribe/unsubscribe.component';
import { MatFormFieldModule } from '@angular/material/form-field';

// Configs

const config = [
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.GOOGLE_ID),
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.FACEBOOK_ID),
  },
];
export function provideConfig() {
  return config;
}

const ROUTES = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reset',
    component: ResetPasswordComponent,
  },
  {
    path: ':id/unsubscribe',
    component: UnsubscribeComponent,
  },
];

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    SocialLoginModule,
    RouterModule.forRoot(ROUTES),
  ],
  declarations: [
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UnsubscribeComponent,
  ],
  entryComponents: [ForgotPasswordComponent],
  providers: [
    BPAuthService,
    AuthGuard,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GOOGLE_ID),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.FACEBOOK_ID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    UserService
  ],
})
export class AuthModule { }
