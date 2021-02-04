import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ProfileComponent } from './profile.component';
import { ChangePasswordComponent } from '../password/change-password.component';
import { ManagePaymentTokensComponent } from '../manage-payment-tokens/manage-payment-tokens.component';

const ROUTES = [
  {
    path: 'profile',
    component: ProfileComponent
  }
];


@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
  declarations: [ProfileComponent, ChangePasswordComponent, ManagePaymentTokensComponent],
  providers: []
})
export class ProfileModule { }
