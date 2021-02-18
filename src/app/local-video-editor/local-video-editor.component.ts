import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { Observable } from "rxjs";
import * as debounce from "lodash.debounce";

@Component({
  selector: "app-local-video-editor",
  templateUrl: "./local-video-editor.component.html",
  styleUrls: ["./local-video-editor.component.css"],
})
export class LocalVideoEditorComponent implements OnInit {
  @ViewChild("videoRef", { static: true }) video: ElementRef;
  @ViewChild("canvasRef", { static: true }) canvas: ElementRef;

  videoObserver;

  videoObservable;

  currentVideoDuration;

  canvasDrawing = {};

  videoStatus = {
    playStatus: "play",
    isEnded: false,
  };

  isPainting: boolean = false;

  canvasCtx;

  currentTime;

  currentRenderObj;

  pointInfo = {
    startTime: 0,
    endTime: 0,
    randomNum: null,
    isStartRecorded: false,
  };

  constructor() {}

  ngOnInit(): void {
    this.canvasCtx = this.canvas.nativeElement.getContext("2d");
    this.canvas.nativeElement.height = window.innerHeight;
    this.canvas.nativeElement.width = window.innerWidth;
    this.madeVideoObserver();
    localStorage.clear();
    this.setCanvasDrawing({});
  }

  ngAfterViewInit() {}

  metaDataLoaded() {
    if (this.videoStatus.playStatus === "pause" || this.videoStatus.isEnded) {
      return;
    }
    const vh = this.video.nativeElement.videoHeight;
    const vw = this.video.nativeElement.videoWidth;
    this.canvas.nativeElement.width = vw;
    this.canvas.nativeElement.height = vh;
  }

  check = true;

  handleDraw = (arr?) => {
    this.canvasDrawing = this.getCanvasDrawing();
    this.canvasCtx.drawImage(this.video.nativeElement, 0, 0);
    requestAnimationFrame(() => {
      this.handleDraw();
      if (this.isPainting) {
        this.startDrawPaint(arr);
      } else if (!this.isPainting) {
        for (let key in this.canvasDrawing) {
          if (
            Math.floor(this.video.nativeElement.currentTime) -
              parseInt(key.split("-")[2]) >=
              0 &&
            Math.floor(this.video.nativeElement.currentTime) -
              parseInt(key.split("-")[2]) <=
              5
          ) {
            this.startDrawPaint(this.canvasDrawing[key]);
          }
        }
        this.canvasDrawing = {};
      }
    });
  };

  handleStartPaint(e) {
    this.canvasDrawing = {};
    this.canvasDrawing = this.getCanvasDrawing();
    this.check = false;
    const axisObj = {
      "x-axis": e.offsetX,
      "y-axis": e.offsetY,
    };
    this.currentTime = Math.floor(this.video.nativeElement.currentTime);
    if (!this.pointInfo["isStartRecorded"]) {
      this.pointInfo["isStartRecorded"] = true;
      this.pointInfo.startTime = Math.floor(
        this.video.nativeElement.currentTime
      );
      this.pointInfo.endTime = this.pointInfo.startTime;
      this.pointInfo.randomNum = Math.random();
      this.canvasDrawing[
        `${this.pointInfo.startTime} - ${this.pointInfo.randomNum} - ${this.pointInfo.endTime}`
      ] = [];
      this.setCanvasDrawing(this.canvasDrawing);
      this.canvasDrawing = {};
    } else {
      const oldEndTime = this.pointInfo.endTime;
      if (this.currentTime > this.pointInfo.endTime) {
        this.pointInfo.endTime = this.currentTime;
        Object.defineProperty(
          this.canvasDrawing,
          `${this.pointInfo.startTime} - ${this.pointInfo.randomNum} - ${this.pointInfo.endTime}`,
          Object.getOwnPropertyDescriptor(
            this.canvasDrawing,
            `${this.pointInfo.startTime} - ${this.pointInfo.randomNum} - ${oldEndTime}`
          )
        );
        delete this.canvasDrawing[
          `${this.pointInfo.startTime} - ${this.pointInfo.randomNum} - ${oldEndTime}`
        ];
        this.setCanvasDrawing(this.canvasDrawing);
        this.canvasDrawing = {};
      }
    }

    this.currentRenderObj = `${this.pointInfo.startTime} - ${this.pointInfo.randomNum} - ${this.pointInfo.endTime}`;

    if (e.type == "mousedown") {
      this.isPainting = true;
      if (this.canvasDrawing[`${this.currentRenderObj}`]) {
        this.canvasDrawing[`${this.currentRenderObj}`].push(axisObj);
      }
      this.setCanvasDrawing(this.canvasDrawing);
      this.handleDraw(this.canvasDrawing[`${this.currentRenderObj}`]);
    } else {
      if (this.isPainting) {
        if (this.canvasDrawing[`${this.currentRenderObj}`]) {
          this.canvasDrawing[`${this.currentRenderObj}`].push(axisObj);
        }
        this.setCanvasDrawing(this.canvasDrawing);
        this.handleDraw(this.canvasDrawing[`${this.currentRenderObj}`]);
      }
    }
  }

  debounce = debounce(this.handleStartPaint, 1);

  handleDebounce = (e) => {
    this.debounce(e);
  };

  handleStopPaint() {
    this.isPainting = false;
    this.canvasCtx.beginPath();
    this.pointInfo.endTime = null;
    this.pointInfo.startTime = null;
    this.pointInfo.randomNum = null;
    this.pointInfo.isStartRecorded = false;
  }

  startDrawPaint = (arr = []) => {
    if (arr.length) {
      for (let i = 0; i < arr.length - 1; i++) {
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(arr[i]["x-axis"], arr[i]["y-axis"]);
        this.canvasCtx.lineWidth = 5;
        this.canvasCtx.lineCap = "round";
        this.canvasCtx.quadraticCurveTo(
          arr[i]["x-axis"],
          arr[i]["y-axis"],
          arr[i + 1]["x-axis"],
          arr[i + 1]["y-axis"]
        );
        this.canvasCtx.stroke();
      }
    }
  };

  madeVideoObserver() {
    this.videoObservable = new Observable((observer) => {
      setInterval(() => {
        observer.next(this.video.nativeElement.currentTime);
      }, 1000);
    });
  }

  subscribeVideoObserver() {
    this.videoObserver = this.videoObservable.subscribe((data) => {
      this.currentVideoDuration = data;
    });
  }

  handleVideoClick(e) {
    if (e.type === "play") {
      this.subscribeVideoObserver();
      this.videoStatus.playStatus = "play";
    } else if (e.type === "pause") {
      this.videoObserver.unsubscribe();
      this.videoStatus.playStatus = "pause";
    }
  }

  getCanvasDrawing() {
    return JSON.parse(localStorage.getItem("canvasDrawingAnnotaion"));
  }

  setCanvasDrawing(data) {
    return localStorage.setItem("canvasDrawingAnnotaion", JSON.stringify(data));
  }
}
