
  import { NgModule } from '@angular/core';
  import { Routes, RouterModule } from '@angular/router';
   import {AdminAuthGuard} from './admin-auth-guard.service'; 
                          import {AdminUserComponent} from '../../admin-user/admin-user.component';
                          import {AdminUserDetailComponent} from '../../admin-user/admin-user-detail/admin-user-detail.component';
                          
  const routes: Routes = [
  
   {
    path: 'test',
    canActivate : [AdminAuthGuard],
    loadChildren: () => import('./admintest/admintest.module').then(m => m.AdminTestModule)
  },
    {
    path: 'user',
    component : AdminUserComponent,
    canActivate : [AdminAuthGuard],
  },
  {
    path: 'user/:id',
    component : AdminUserDetailComponent,
    canActivate : [AdminAuthGuard],
  },
    
   {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
  ];
  
  @NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
  })
  export class AdminRoutingModule { }
  