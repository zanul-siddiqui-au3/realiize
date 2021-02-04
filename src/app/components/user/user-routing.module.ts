
  import { NgModule } from '@angular/core';
  import { Routes, RouterModule } from '@angular/router';
   import { StripeSubscriptionComponent } from '../../stripe-subscription/stripe-subscription.component';
  const routes: Routes = [
  
   {
    path: 'test',
    
    loadChildren: () => import('./test/test.module').then(m => m.TestModule)
  },
    {
    path : 'payment',
    component : StripeSubscriptionComponent
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
  export class UserRoutingModule { }
  