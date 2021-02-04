import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
} from "@angular/core";
import * as RecordRTC from "recordrtc/RecordRTC.min";
import * as moment from "moment";
import { AwsUploadService } from "../services/user/aws-upload.service";
import { UserService } from "../auth/user-service.service";
import Swal from "sweetalert2";
import { KeyValue } from "@angular/common";
import { resolve } from "dns";
@Component({
  selector: "app-screen-recorder",
  templateUrl: "./screen-recorder.component.html",
  styleUrls: ["./screen-recorder.component.css"],
})
export class ScreenRecorderComponent implements OnInit, AfterViewInit {
  @ViewChild("videoRef", { static: true }) video: ElementRef;
  @ViewChild("videoContainer", { static: true }) videoConatiner: ElementRef;
  @ViewChild("downloadLink", { static: true }) downloadLinkRef: ElementRef;

  recordOption = {
    isStart: false,
    isDownloadAvailable: false,
  };

  mainVideo;

  camera;

  screen;

  recorder;

  videoFile;

  videoTranscript;

  videoName;

  isLoading: boolean = false;

  constructor(
    private render: Renderer2,
    private awsUploadService: AwsUploadService,
    private userService: UserService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}

  invokeGetDisplayMedia(success, error) {
    var displaymediastreamconstraints = {
      video: {
        displaySurface: "monitor", // monitor, window, application, browser
        logicalSurface: true,
        cursor: "always", // never, always, motion
      },
    };

    // above constraints are NOT supported YET
    // that's why overridnig them
    // ts
    displaymediastreamconstraints = {
      // @ts-ignore
      video: true,
    };
    // @ts-ignore
    if (navigator.mediaDevices.getDisplayMedia) {
      // @ts-ignore
      navigator.mediaDevices
        // @ts-ignore
        .getDisplayMedia(displaymediastreamconstraints)
        .then(success)
        .catch(error);
    } else {
      // @ts-ignore
      navigator
        // @ts-ignore
        .getDisplayMedia(displaymediastreamconstraints)
        .then(success)
        .catch(error);
    }
  }

  captureScreen(callback) {
    this.invokeGetDisplayMedia(
      (screen) => {
        this.addStreamStopListener(screen, function () {
          // @ts-ignore
          if (window.stopCallback) {
            // @ts-ignore
            window.stopCallback();
          }
        });
        callback(screen);
      },
      function (error) {
        console.error(error);
        alert(
          "Unable to capture your screen. Please check console logs.\n" + error
        );
      }
    );
  }

  captureCamera(cb) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(cb);
  }

  addStreamStopListener(stream, callback) {
    stream.addEventListener(
      "ended",
      function () {
        callback();
        callback = function () {};
      },
      false
    );
    stream.addEventListener(
      "inactive",
      function () {
        callback();
        callback = function () {};
      },
      false
    );
    stream.getTracks().forEach(function (track) {
      track.addEventListener(
        "ended",
        function () {
          callback();
          callback = function () {};
        },
        false
      );
      track.addEventListener(
        "inactive",
        function () {
          callback();
          callback = function () {};
        },
        false
      );
    });
  }

  keepStreamActive(stream) {
    this.mainVideo = this.render.createElement("video");
    this.render.setAttribute(this.mainVideo, "muted", "true");
    this.render.setProperty(this.mainVideo, "srcObject", stream);
    this.render.setStyle(this.mainVideo, "display", "none");
    this.render.appendChild(this.videoConatiner.nativeElement, this.mainVideo);
  }

  handleStartRecording() {
    this.recordOption.isStart = !this.recordOption.isStart;
    this.captureScreen((screen) => {
      this.keepStreamActive(screen);
      this.captureCamera((camera) => {
        this.keepStreamActive(camera);
        this.screen = screen;
        this.camera = camera;
        this.screen.width = window.screen.width;
        this.screen.height = window.screen.height;
        this.screen.fullcanvas = true;
        this.camera.width = 320;
        this.camera.height = 240;
        this.camera.top = this.screen.height - this.camera.height;
        this.camera.left = this.screen.width - this.camera.width;
        this.recorder = RecordRTC([this.screen, this.camera], {
          type: "video",
          mimeType: "video/webm",
          numberOfAudioChannels: 1,
          desiredSampRate: 16000,
          frameInterval: 200,
          bufferSize: 1024,
          previewStream: (s) => {
            this.video.nativeElement.muted = true;
            this.video.nativeElement.srcObject = s;
          },
        });
        this.recorder.startRecording();
      });
    });
  }

  handleStopRecording() {
    this.recordOption.isStart = !this.recordOption.isStart;
    this.handleStopRecordingOption().then(() => {
      this.handleUploadBlob();
    });
  }

  handleStopRecordingOption = () => {
    return new Promise((resolve, reject) => {
      this.recorder.stopRecording(() => {
        var blob = this.recorder.getBlob();

        this.render.setAttribute(
          this.downloadLinkRef.nativeElement,
          "href",
          URL.createObjectURL(blob)
        );
        this.videoName = `${moment().format(
          "MM-DD-YYYY__HH-mm-ss"
        )}_recorderVideo.mkv`;
        this.videoFile = new File([blob], this.videoName);
        this.recordOption.isDownloadAvailable = true;
        this.render.setProperty(this.video.nativeElement, "muted", true);
        this.render.setProperty(this.video.nativeElement, "srcObject", null);
        this.render.setProperty(
          this.video.nativeElement,
          "src",
          URL.createObjectURL(blob)
        );
        this.screen.getTracks().forEach((track) => track.stop());
        this.camera.getTracks().forEach((track) => track.stop());
        // [(this.screen, this.camera)].forEach(function (stream) {
        //   stream.getTracks().forEach(function (track) {
        //     track.stop();
        //   });
        // });
        resolve(true);
      });
    });
  };

  handleUploadBlob = async () => {
    try {
      this.isLoading = true;
      const fileData = await this.awsUploadService.uploadToS3(this.videoFile);
      const fileName = this.videoName;
      this.userService
        .getTranscript({ fileData: fileData["Location"], fileName })
        .subscribe(
          (data) => {
            this.videoTranscript = data;
            this.isLoading = false;
          },
          (error: any) => {
            Swal({
              type: "error",
              title: `Oops... ${error.error.name}!`,
              text: error.error.message,
            });
            this.isLoading = false;
            console.error(`Error: ${error}`);
            throw error;
          }
        );
    } catch (error) {
      Swal({
        type: "error",
        title: `Oops... ${error.error.name}!`,
        text: error.error.message,
      });
      console.error(`Error: ${error}`);
      this.isLoading = false;
      throw error;
    }
  };

  fancyTimeFormat(duration) {
    const durationArr = duration.split("-");
    let prettyDurationArr = [];
    for (let i = 0; i < durationArr.length; i++) {
      // Hours, minutes and seconds
      const hrs = ~~(durationArr[i] / 3600);
      const mins = ~~((durationArr[i] % 3600) / 60);
      const secs = ~~durationArr[i] % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      let ret = "";

      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      prettyDurationArr.push(ret);
    }
    return prettyDurationArr.join(" - ");
  }

  originalOrder = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    return 0;
  };
}
