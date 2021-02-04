
        import { NgModule } from '@angular/core';
        import { CommonModule } from '@angular/common';
        import {MatButtonModule} from '@angular/material/button';
        import {MatInputModule} from '@angular/material/input';
        import { MatTableModule } from '@angular/material/table'; 
        import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
        import {MatExpansionModule} from '@angular/material/expansion';
        import {MatFormFieldModule} from '@angular/material/form-field';
        import { FormsModule , ReactiveFormsModule } from '@angular/forms';
        import {MatPaginatorModule} from '@angular/material/paginator';
        import { UserRoutingModule } from './user-routing.module';
        import { StripeSubscriptionComponent } from '../../stripe-subscription/stripe-subscription.component';
                                 import { PaymentService } from '../../payment/payment.service';
                                 import { PaymentComponent } from '../../payment/payment.component';
        @NgModule({
          imports: [
            CommonModule,
            MatButtonModule,
            MatTableModule,
            MatInputModule,
            MatProgressSpinnerModule,
            MatExpansionModule,
            MatFormFieldModule,
            FormsModule,
            MatPaginatorModule,
            ReactiveFormsModule,
            UserRoutingModule
          ],
          declarations: [StripeSubscriptionComponent , PaymentComponent], 
          providers : [PaymentService]
        })
        export class UserModule { }
            