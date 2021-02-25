import { Component, OnInit } from "@angular/core";
import * as parseSRT from "parse-srt";
import Swal from "sweetalert2";
import { UserService } from "../auth/user-service.service";

@Component({
  selector: "app-video-transcript-dialog",
  templateUrl: "./video-transcript-dialog.component.html",
  styleUrls: ["./video-transcript-dialog.component.css"],
})
export class VideoTranscriptDialogComponent implements OnInit {
  videoSubtitle = {
    english: `
    1
    00:00:00,000 --> 00:00:04,000
    If

    2
    00:00:04,000 --> 00:00:08,000
    you want something you've never had before you must do

    3
    00:00:08,000 --> 00:00:14,000
    something you've never done before it's taken me years tragedy

    4
    00:00:14,000 --> 00:00:18,000
    of losing myself inside only to realize what I must

    5
    00:00:18,000 --> 00:00:23,000
    have always known that you can be anything you dream.

    6
    00:00:24,000 --> 00:00:32,000
    dream dream until your dreams come true on your passion.

    7
    00:00:32,000 --> 00:00:35,000
    And when your shot comes take it look fear in

    8
    00:00:35,000 --> 00:00:39,000
    the face and embrace it the time is now the

    9
    00:00:39,000 --> 00:00:44,000
    moment is now fully believe in yourself. Like I believe

    10
    00:00:44,000 --> 00:00:49,000
    this to be true the world needs more of youas
    
    11
    00:01:46,000 --> 00:01:59,000
    asdadaddadaadada
    `,
    spanish: ``,
    hindi: ``,
  };

  requestStatus = {
    isLoading: false,
    isError: false,
    error: ``,
  };

  videoTranscriptJson = {
    english: [],
    spanish: [],
    hindi: [],
  };

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.videoTranscriptJson.english = parseSRT(this.videoSubtitle.english);
    console.log(this.videoTranscriptJson.english);
  }

  getSubtitle(lang) {
    this.requestStatus.isLoading = true;
    this.userService.getSubtitles(lang).subscribe(
      (data) => {
        if (lang === "es") {
          this.videoSubtitle.spanish = data;
          // this.videoTranscriptJson.spanish = parseSRT(
          //   this.videoSubtitle.spanish
          // );
        } else if (lang === "hi") {
          this.videoSubtitle.hindi = data;
          // this.videoTranscriptJson.hindi = parseSRT(this.videoSubtitle.hindi);
        }
        this.requestStatus.isLoading = false;
        this.requestStatus.isError = false;
        this.requestStatus.error = "";
      },
      (error) => {
        this.requestStatus.isLoading = false;
        this.requestStatus.isError = true;
        this.requestStatus.error = error.error.message;
        Swal({
          type: "error",
          title: `Oops... ${error.error.name}!`,
          text: error.error.message,
        });
      }
    );
  }
}
