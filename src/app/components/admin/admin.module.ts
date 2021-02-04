
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
        import { AdminRoutingModule } from './admin-routing.module';
        import {AdminUserComponent} from '../../admin-user/admin-user.component';  
                                 import {AdminUserDetailComponent} from '../../admin-user/admin-user-detail/admin-user-detail.component';
                                 import {PaymentService} from '../../payment/payment.service';
                                 import {AdminAuthGuard} from './admin-auth-guard.service';
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
            AdminRoutingModule
          ],
          declarations: [AdminUserComponent , AdminUserDetailComponent], 
          providers: [AdminAuthGuard , PaymentService]
        })
        export class AdminModule { }
            