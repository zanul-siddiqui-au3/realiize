 import { NgModule } from '@angular/core';
      import { CommonModule } from '@angular/common';
      import {SharedModule} from '../../../shared.module';
      import { TestRoutingModule } from './test-routing.module';
      
                  import { TestComponent } from  './test/test.component';
                  
          import { TestDetailComponent } from './testDetail/test-detail.component';
            
          import { TestCreateEditComponent } from './testCreateEdit/test-create-edit.component';
               
    @NgModule({
      imports: [
        CommonModule,
        TestRoutingModule,
        SharedModule
      ],
      declarations: [
                  TestComponent,TestDetailComponent,
        TestCreateEditComponent,
        ]})
    export class TestModule { }
        