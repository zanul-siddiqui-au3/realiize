import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import * as RecordRTC from "recordrtc/RecordRTC.min";
import * as moment from "moment";
import { AwsUploadService } from "../services/user/aws-upload.service";
import { UserService } from "../auth/user-service.service";
import Swal from "sweetalert2";
import { KeyValue } from "@angular/common";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Component({
  selector: "app-screen-recorder",
  templateUrl: "./screen-recorder.component.html",
  styleUrls: ["./screen-recorder.component.css"],
})
export class ScreenRecorderComponent
  implements OnInit, AfterViewInit, OnDestroy {
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

  isLoading: boolean = false;

  videoData = {
    videoName: "",
    videoTranscript: "",
    videoFile: null,
    awsUrl: "",
    isRecorded: false,
    videoLength: null,
  };

  dateStarted = null;

  commentText: string = "";

  commentTimeStampObj = {};

  videoObserver;

  videoObservable;

  currentVideoDuration;

  constructor(
    private render: Renderer2,
    private awsUploadService: AwsUploadService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.madeVideoObserver();
  }

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
        this.dateStarted = new Date().getTime();
      });
    });
  }

  handleStopRecording() {
    this.recordOption.isStart = !this.recordOption.isStart;
    this.handleStopRecordingOption().then(() => {
      this.handleUploadBlob();
      // this.subscribeVideoObserver();
    });
  }

  handleStopRecordingOption = () => {
    return new Promise((resolve, reject) => {
      this.recorder.stopRecording(() => {
        this.videoData.videoLength =
          (new Date().getTime() - this.dateStarted) / 1000;
        var blob = this.recorder.getBlob();
        this.render.setAttribute(
          this.downloadLinkRef.nativeElement,
          "href",
          URL.createObjectURL(blob)
        );
        this.videoData.videoName = `${moment().format(
          "MM-DD-YYYY__HH-mm-ss"
        )}_recorderVideo.mkv`;
        this.videoData.videoFile = new File([blob], this.videoData.videoName);
        this.recordOption.isDownloadAvailable = true;
        this.render.setProperty(this.video.nativeElement, "muted", true);
        this.render.setProperty(this.video.nativeElement, "srcObject", null);
        this.render.setProperty(
          this.video.nativeElement,
          "src",
          `${URL.createObjectURL(blob)}#t=${this.videoData.videoLength - 2},${
            this.videoData.videoLength
          }`
        );
        this.screen.getTracks().forEach((track) => track.stop());
        this.camera.getTracks().forEach((track) => track.stop());
        resolve(true);
      });
    });
  };

  handleUploadBlob = async () => {
    this.isLoading = true;
    this.videoData.isRecorded = true;
    this.awsUploadService
      .getSignedUrlS3(this.videoData.videoName, "video/x-matroska")
      .subscribe(({ url, keyFile }) => {
        this.awsUploadService
          .uploadfileAWSS3(url, "video/x-matroska", this.videoData.videoFile)
          .subscribe(
            (data) => {
              if (data["url"]) {
                this.videoData.awsUrl = `https://${environment.S3_BUCKET_NAME}.s3.${environment.S3_Region}.amazonaws.com/${keyFile}`;
                this.userService
                  .getTranscript({
                    fileData: this.videoData.awsUrl,
                    fileName: this.videoData.videoName,
                  })
                  .subscribe(
                    (data) => {
                      this.videoData.videoTranscript = data;
                      this.isLoading = false;
                      this.videoData.isRecorded = true;
                    },
                    (error) => {
                      Swal({
                        type: "error",
                        title: `Oops... ${error.error.name}!`,
                        text: error.error.message,
                      });
                      this.isLoading = false;
                      throw error;
                    }
                  );
              }
            },
            (error) => {
              Swal({
                type: "error",
                title: `Oops... ${error.error.name}!`,
                text: error.error.message,
              });
              this.isLoading = false;
              throw error;
            }
          );
        (error) => {
          Swal({
            type: "error",
            title: `Oops... ${error.error.name}!`,
            text: error.error.message,
          });
          this.isLoading = false;
          throw error;
        };
      });
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

  fancySecondtoMinute(minute) {
    const hrs = ~~(minute / 3600);
    const mins = ~~((minute % 3600) / 60);
    const secs = ~~minute % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";

    if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  }

  handleAddComment = () => {
    this.commentTimeStampObj[
      this.fancySecondtoMinute(Math.floor(this.video.nativeElement.currentTime))
    ] = this.commentText;
  };

  madeVideoObserver() {
    this.videoObservable = new Observable((observer) => {
      setInterval(() => {
        observer.next(
          this.fancySecondtoMinute(
            Math.floor(this.video.nativeElement.currentTime)
          )
        );
      }, 1000);
    });
  }

  subscribeVideoObserver() {
    this.videoObserver = this.videoObservable.subscribe((data) => {
      this.currentVideoDuration = data;
    });
  }

  handleVideoClick(e) {
    if (this.videoData.isRecorded) {
      if (e.type === "play") {
        this.subscribeVideoObserver();
      } else if (e.type === "pause") {
        this.videoObserver.unsubscribe();
      }
    }
  }

  handleHighlighedComment(key) {
    const currentTime = this.convertIntoSeconds(this.currentVideoDuration);
    const keyTime = this.convertIntoSeconds(key);
    if (currentTime - keyTime <= 5 && currentTime - keyTime >= 0) {
      return true;
    } else {
      return false;
    }
  }

  convertIntoSeconds(time) {
    const timeArr = time.split(":");
    let timeInSeconds;
    if (timeArr.length === 2) {
      timeInSeconds = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
    }
    if (timeArr.length === 3) {
      timeInSeconds =
        parseInt(time[0]) * 3600 + parseInt(time[1]) * 60 + parseInt(time[2]);
    }
    return timeInSeconds;
  }

  handleRedirectVideo(key) {
    let timeInSeconds = this.convertIntoSeconds(key);
    this.video.nativeElement.currentTime = timeInSeconds;
  }

  ngOnDestroy() {
    this.videoObserver.unsubscribe();
  }
}
