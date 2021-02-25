import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MaterialModule } from "./material.module";
import { AppComponent } from "./app.component";
import { AuthUserService } from "./auth.user.service";
import { AuthModule } from "./auth/auth.module";
import { AuthGuard } from "./auth/auth-guard.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./token.interceptor";

// modules
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AdminTestService } from "./services/admin/admintest.service";
import { TestService } from "./services/user/test.service";
import { ScreenRecorderComponent } from "./screen-recorder/screen-recorder.component";
import { AudioTranscriptComponent } from "./audio-transcript/audio-transcript.component";
import { AtramentVideoEditorComponent } from "./atrament-video-editor/atrament-video-editor.component";
import { LocalVideoEditorComponent } from "./local-video-editor/local-video-editor.component";
import { VolumeControlDirective } from "./atrament-video-editor/directives/volume-control.directive";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { VideoTranscriptDialogComponent } from './video-transcript-dialog/video-transcript-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    ScreenRecorderComponent,
    AudioTranscriptComponent,
    AtramentVideoEditorComponent,
    LocalVideoEditorComponent,
    VolumeControlDirective,
    VideoTranscriptDialogComponent,
  ],
  imports: [
    AppRoutingModule,
    HttpClientModule,
    MaterialModule,
    AuthModule,
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
  ],
  providers: [
    AuthUserService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    TestService,
    AdminTestService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
