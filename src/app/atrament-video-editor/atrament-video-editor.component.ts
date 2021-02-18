import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-atrament-video-editor",
  templateUrl: "./atrament-video-editor.component.html",
  styleUrls: ["./atrament-video-editor.component.css"],
})
export class AtramentVideoEditorComponent implements OnInit {
  @ViewChild("videoRef", { static: true }) video: ElementRef;
  @ViewChild("canvasRef", { static: true }) canvas: ElementRef;

  videoObserver;

  videoObservable;

  currentVideoDuration;

  canvasDrawing = {};

  canvasHighlightDrawing = {};

  currentDrawingTool: string = "";

  videoStatus = {
    playStatus: "pause",
    volume: 0.7,
    currentTime: 0,
    totalTime: 0,
    isNotFullScreen: true,
    isEnded: false,
  };

  isPainting: boolean = false;

  canvasCtx;

  currentTime;

  currentHighlighterTime: number = null;

  currentRenderObj;

  pointInfo = {
    startTime: 0,
    endTime: 0,
    randomNum: null,
    isStartRecorded: false,
  };

  pointInfoHiglight = {
    startTime: 0,
    endTime: 0,
    randomNum: null,
    isStartRecorded: false,
    previousX: null,
    previousY: null,
  };

  drawingDetails = {
    strokeLength: 5,
    strokeColor: "black",
  };

  timer;

  highLighterTimer;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.canvasCtx = this.canvas.nativeElement.getContext("2d");
    this.madeVideoObserver();
  }

  metaDataLoaded() {
    if (this.videoStatus.isEnded) {
      return;
    }
    const vh = this.video.nativeElement.videoHeight;
    const vw = this.video.nativeElement.videoWidth;
    this.canvas.nativeElement.width = vw;
    this.canvas.nativeElement.height = vh;
    this.videoStatus.totalTime = this.video.nativeElement.duration;
    this.handleDraw();
  }

  handleDraw = (arr?) => {
    this.canvasCtx.drawImage(this.video.nativeElement, 0, 0);
    this.timer = requestAnimationFrame(() => {
      this.handleDraw();
      if (this.isPainting) {
        if (this.currentDrawingTool == "highLight") {
          this.startDrawHiglightPaint(arr);
        } else {
          this.startDrawPaint(arr);
        }
        if (Object.keys(this.canvasDrawing).length !== 0) {
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
        }
        if (Object.keys(this.canvasHighlightDrawing).length !== 0) {
          for (let key in this.canvasHighlightDrawing) {
            if (
              this.video.nativeElement.currentTime -
                parseFloat(key.split("-")[2]) >=
                0 &&
              this.video.nativeElement.currentTime -
                parseFloat(key.split("-")[2]) <=
                0.1
            ) {
              this.startDrawHiglightPaint(this.canvasHighlightDrawing[key]);
            }
          }
        }
      } else if (!this.isPainting) {
        if (Object.keys(this.canvasDrawing).length !== 0) {
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
        }
        if (Object.keys(this.canvasHighlightDrawing).length !== 0) {
          for (let key in this.canvasHighlightDrawing) {
            if (
              this.video.nativeElement.currentTime -
                parseFloat(key.split("-")[2]) >=
                0 &&
              this.video.nativeElement.currentTime -
                parseFloat(key.split("-")[2]) <=
                0.1
            ) {
              this.startDrawHiglightPaint(this.canvasHighlightDrawing[key]);
            }
          }
        }
      }
    });
  };
  count = 1;
  handleCheckCircleOverlap() {
    if (this.count === 1) {
      this.count = 0;
      return true;
    } else {
      this.count++;
      return false;
    }
    // var DistanceX = xAxis - pxAxis;
    // var DistanceY = yAxis - pyAxis;
    // var DistanceCenter = Math.sqrt(
    //   DistanceX * DistanceX + DistanceY * DistanceY
    // );
    // var CollisionDistance = 5;
    // CollisionDistance += 5;
    // if (DistanceCenter >= CollisionDistance) return true;
    // else return false;
  }

  handleStartPaint(e) {
    if (
      this.currentDrawingTool === "annotate" ||
      this.currentDrawingTool === "highLight"
    ) {
      const precentageAxisObj = this.convertAxisToPercent(e.offsetX, e.offsetY);
      this.currentTime = Math.floor(this.video.nativeElement.currentTime);
      this.currentHighlighterTime = this.video.nativeElement.currentTime;

      if (this.currentDrawingTool === "annotate") {
        if (
          Object.keys(this.canvasDrawing).length === 0 ||
          !this.pointInfo.isStartRecorded
        ) {
          this.pointInfo["isStartRecorded"] = true;
          this.pointInfo.startTime = Math.floor(
            this.video.nativeElement.currentTime
          );
          this.pointInfo.endTime = this.pointInfo.startTime;
          this.pointInfo.randomNum = Math.random();
          this.canvasDrawing[
            `${this.pointInfo.startTime} - ${this.pointInfo.randomNum} - ${this.pointInfo.endTime}`
          ] = [];
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
          }
        }

        this.currentRenderObj = `${this.pointInfo.startTime} - ${this.pointInfo.randomNum} - ${this.pointInfo.endTime}`;

        if (e.type == "mousedown") {
          this.isPainting = true;
          if (this.canvasDrawing[`${this.currentRenderObj}`]) {
            this.canvasDrawing[`${this.currentRenderObj}`].push(
              precentageAxisObj
            );
          }
          cancelAnimationFrame(this.timer);
          this.handleDraw(this.canvasDrawing[`${this.currentRenderObj}`]);
        } else {
          if (this.isPainting) {
            if (this.canvasDrawing[`${this.currentRenderObj}`]) {
              this.canvasDrawing[`${this.currentRenderObj}`].push(
                precentageAxisObj
              );
            }
            cancelAnimationFrame(this.timer);
            this.handleDraw(this.canvasDrawing[`${this.currentRenderObj}`]);
          }
        }
      }

      if (this.currentDrawingTool === "highLight") {
        if (e.type === "mousedown") {
          this.isPainting = true;
        }

        if (
          (Object.keys(this.canvasHighlightDrawing).length === 0 ||
            !this.pointInfoHiglight.isStartRecorded) &&
          this.isPainting
        ) {
          this.pointInfoHiglight["isStartRecorded"] = true;
          this.pointInfoHiglight.startTime = this.video.nativeElement.currentTime;
          this.pointInfoHiglight.endTime = this.video.nativeElement.currentTime;
          this.pointInfoHiglight.randomNum = Math.random();
          this.canvasHighlightDrawing[
            `${this.pointInfoHiglight.startTime} - ${this.pointInfoHiglight.randomNum} - ${this.pointInfoHiglight.endTime}`
          ] = {};
        }

        this.currentRenderObj = `${this.pointInfoHiglight.startTime} - ${this.pointInfoHiglight.randomNum} - ${this.pointInfoHiglight.endTime}`;

        if (e.type == "mousedown") {
          if (this.isPainting && this.handleCheckCircleOverlap()) {
            if (this.canvasHighlightDrawing[`${this.currentRenderObj}`]) {
              this.canvasHighlightDrawing[`${this.currentRenderObj}`] = {
                ...precentageAxisObj,
              };
            }
            cancelAnimationFrame(this.timer);
            this.handleDraw(
              this.canvasHighlightDrawing[`${this.currentRenderObj}`]
            );
            this.pointInfoHiglight.previousX = e.offsetX;
            this.pointInfoHiglight.previousY = e.offsetY;
          }
        } else {
          if (this.isPainting && this.handleCheckCircleOverlap()) {
            if (this.canvasHighlightDrawing[`${this.currentRenderObj}`]) {
              this.canvasHighlightDrawing[`${this.currentRenderObj}`] = {
                ...precentageAxisObj,
              };
            }
            cancelAnimationFrame(this.timer);
            this.handleDraw(
              this.canvasHighlightDrawing[`${this.currentRenderObj}`]
            );
            this.pointInfoHiglight.previousX = e.offsetX;
            this.pointInfoHiglight.previousY = e.offsetY;
          }
        }
        this.pointInfoHiglight.endTime = null;
        this.pointInfoHiglight.startTime = null;
        this.pointInfoHiglight.randomNum = null;
        this.pointInfoHiglight.isStartRecorded = false;
      }
    }
  }

  convertAxisToPercent = (xAxis, yAxis) => {
    const precentageAxisObj = {
      "x-axis": null,
      "y-axis": null,
      "stroke-length": this.drawingDetails["strokeLength"] || 5,
      "stroke-color": this.drawingDetails["strokeColor"] || "black",
    };
    precentageAxisObj["x-axis"] =
      (xAxis / this.canvas.nativeElement.width) * 100;
    precentageAxisObj["y-axis"] =
      (yAxis / this.canvas.nativeElement.height) * 100;
    return precentageAxisObj;
  };

  handleStopPaint() {
    this.isPainting = false;
    this.canvasCtx.beginPath();
    if (this.currentDrawingTool === "annotate") {
      this.canvasDrawing[this.currentRenderObj] = this.canvasDrawing[
        this.currentRenderObj
      ].filter((ele, i) => i % 2 === 0);
      this.pointInfo.endTime = null;
      this.pointInfo.startTime = null;
      this.pointInfo.randomNum = null;
      this.pointInfo.isStartRecorded = false;
    }
    if (this.currentDrawingTool === "highLight") {
      this.pointInfoHiglight.endTime = null;
      this.pointInfoHiglight.startTime = null;
      this.pointInfoHiglight.randomNum = null;
      this.pointInfoHiglight.isStartRecorded = false;
      for (let key in this.canvasHighlightDrawing) {
        if (Object.keys(this.canvasHighlightDrawing[key]).length === 0) {
          delete this.canvasHighlightDrawing[key];
        }
      }
      console.log(this.canvasHighlightDrawing);
    }
  }

  convertPercentageToAxis = (xAxis, yAxis) => {
    const axisObj = {
      xAxis: null,
      yAxis: null,
    };
    axisObj["xAxis"] = (this.canvas.nativeElement.width / 100) * xAxis;
    axisObj["yAxis"] = (this.canvas.nativeElement.height / 100) * yAxis;
    return axisObj;
  };

  startDrawPaint = (arr = []) => {
    if (arr.length) {
      for (let i = 0; i < arr.length - 1; i++) {
        const { xAxis, yAxis } = this.convertPercentageToAxis(
          arr[i]["x-axis"],
          arr[i]["y-axis"]
        );
        const nextAxisObj = this.convertPercentageToAxis(
          arr[i + 1]["x-axis"],
          arr[i + 1]["y-axis"]
        );
        this.canvasCtx.beginPath();
        this.canvasCtx.moveTo(xAxis, yAxis);
        this.canvasCtx.lineWidth = arr[i]["stroke-length"];
        this.canvasCtx.lineCap = "round";
        this.canvasCtx.quadraticCurveTo(
          xAxis,
          yAxis,
          nextAxisObj.xAxis,
          nextAxisObj.yAxis
        );
        this.canvasCtx.strokeStyle = arr[i]["stroke-color"];
        this.canvasCtx.stroke();
      }
    }
  };

  startDrawHiglightPaint = (obj) => {
    if (obj != undefined) {
      const { xAxis, yAxis } = this.convertPercentageToAxis(
        obj["x-axis"],
        obj["y-axis"]
      );
      this.canvasCtx.beginPath();
      this.canvasCtx.arc(xAxis, yAxis, 5, 0, 2 * Math.PI);
      this.canvasCtx.fillStyle = obj["stroke-color"];
      this.canvasCtx.strokeStyle = obj["stroke-color"];
      this.canvasCtx.fill();
      this.canvasCtx.stroke();
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
      this.videoStatus.currentTime = this.currentVideoDuration;
    });
  }

  handleVideoClick({ type }) {
    if (type === "play") {
      this.subscribeVideoObserver();
      this.videoStatus.playStatus = "play";
      this.video.nativeElement.play();
    } else if (type === "pause") {
      this.videoObserver.unsubscribe();
      this.videoStatus.playStatus = "pause";
      this.video.nativeElement.pause();
    } else if (type === "volume") {
      this.video.nativeElement.volume = this.videoStatus.volume;
    } else if (type === "slider") {
      this.video.nativeElement.currentTime = this.videoStatus.currentTime;
      if (this.videoStatus.playStatus === "play") {
        this.videoStatus.playStatus = "play";
        this.video.nativeElement.play();
      } else if (this.videoStatus.playStatus === "pause") {
        this.videoStatus.playStatus = "pause";
        this.video.nativeElement.pause();
      }
    } else if (type === "fullScreen") {
      this.videoStatus.isNotFullScreen = !this.videoStatus.isNotFullScreen;
      // this.canvas.nativeElement.width = window.innerWidth;
      // this.canvas.nativeElement.height = window.innerHeight;
    }
  }

  handleButtonToggle(e) {
    this.currentDrawingTool = e.value;
  }
}
