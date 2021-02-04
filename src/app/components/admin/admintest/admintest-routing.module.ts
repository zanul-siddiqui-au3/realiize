
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

                  import { AdminTestComponent } from  './test/admintest.component';
                  
                    import { AdminTestDetailComponent } from './testDetail/admintest-detail.component';
                     
                    import { AdminTestCreateEditComponent } from './testCreateEdit/admintest-create-edit.component';
                     
const routes: Routes = [
{
    path: '',
    component: AdminTestComponent,
},

  {
      path: 'edit/:id',
      component: AdminTestCreateEditComponent,
  },
  {
    path: 'create',
    component: AdminTestCreateEditComponent,
},


  
  {
      path: ':id',
      component: AdminTestDetailComponent,
  },
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminTestRoutingModule { }
