import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AtramentVideoEditorComponent } from "./atrament-video-editor/atrament-video-editor.component";
import { AudioTranscriptComponent } from "./audio-transcript/audio-transcript.component";
import { AuthGuard } from "./auth/auth-guard.service";
import { LocalVideoEditorComponent } from "./local-video-editor/local-video-editor.component";
import { ScreenRecorderComponent } from "./screen-recorder/screen-recorder.component";

const routes: Routes = [
  {
    path: "recorder",
    component: ScreenRecorderComponent,
  },
  {
    path: "audio/transcript",
    component: AudioTranscriptComponent,
  },
  {
    path: "video/editor/test",
    component: AtramentVideoEditorComponent,
  },
  {
    path: "local/editor",
    component: LocalVideoEditorComponent,
  },
  {
    path: "admin",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./components/admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "user",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./components/user/user.module").then((m) => m.UserModule),
  },
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
