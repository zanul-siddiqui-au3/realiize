
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioTranscriptComponent } from './audio-transcript/audio-transcript.component';
import {AuthGuard} from './auth/auth-guard.service';
import { ScreenRecorderComponent } from './screen-recorder/screen-recorder.component';


const routes: Routes = [
  {
    path : 'recorder',
    component: ScreenRecorderComponent
  },
  {
    path : 'audio/transcript',
    component : AudioTranscriptComponent
  },
  {
    path: 'admin',
    canActivate : [AuthGuard],
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'user',
    canActivate : [AuthGuard],
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }

