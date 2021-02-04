import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PaypalComponent } from './paypal/paypal.component';


// Services
import { PaymentService } from './payment.service';

const ROUTES = [
];

@NgModule({
  imports: [
    MaterialModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES)
  ],
  declarations: [ PaypalComponent],
  providers: [PaymentService]
})
export class PaymentModule { }
