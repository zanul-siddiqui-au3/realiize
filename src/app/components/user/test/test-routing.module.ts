
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

                  import { TestComponent } from  './test/test.component';
                  
                    import { TestDetailComponent } from './testDetail/test-detail.component';
                     
                    import { TestCreateEditComponent } from './testCreateEdit/test-create-edit.component';
                     
const routes: Routes = [
{
    path: '',
    component: TestComponent,
},

  {
      path: 'edit/:id',
      component: TestCreateEditComponent,
  },
  {
    path: 'create',
    component: TestCreateEditComponent,
},


  
  {
      path: ':id',
      component: TestDetailComponent,
  },
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TestRoutingModule { }
