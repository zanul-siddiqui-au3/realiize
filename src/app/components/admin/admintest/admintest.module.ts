 import { NgModule } from '@angular/core';
      import { CommonModule } from '@angular/common';
      import {SharedModule} from '../../../shared.module';
      import { AdminTestRoutingModule } from './adminTest-routing.module';
      
                  import { AdminTestComponent } from  './test/admintest.component';
                  
          import { AdminTestDetailComponent } from './testDetail/admintest-detail.component';
            
          import { AdminTestCreateEditComponent } from './testCreateEdit/admintest-create-edit.component';
               
    @NgModule({
      imports: [
        CommonModule,
        AdminTestRoutingModule,
        SharedModule
      ],
      declarations: [
                  AdminTestComponent,AdminTestDetailComponent,
        AdminTestCreateEditComponent,
        ]})
    export class AdminTestModule { }
        