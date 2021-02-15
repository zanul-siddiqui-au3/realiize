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

  pointInfoHiglight = {
    startTime: 0,
    endTime: 0,
    randomNum: null,
    isStartRecorded: false,
  };

  drawingDetails = {
    strokeLength: 5,
    strokeColor: "black",
  };

  timer;

  constructor() {}

  ngOnInit(): void {
    this.canvasCtx = this.canvas.nativeElement.getContext("2d");
    this.madeVideoObserver();
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
    this.handleDraw();
  }

  handleDraw = (arr?) => {
    this.canvasCtx.drawImage(this.video.nativeElement, 0, 0);
    this.timer = requestAnimationFrame(() => {
      this.handleDraw();
      if (this.isPainting) {
        this.startDrawPaint(arr);
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
              Math.floor(this.video.nativeElement.currentTime) -
                parseInt(key.split("-")[2]) >=
                0 &&
              Math.floor(this.video.nativeElement.currentTime) -
                parseInt(key.split("-")[2]) <=
                1
            ) {
              this.startDrawPaint(this.canvasHighlightDrawing[key]);
            }
          }
        }
      }
    });
  };

  handleStartPaint(e) {
    const precentageAxisObj = this.convertAxisToPercent(e.offsetX, e.offsetY);
    this.currentTime = Math.floor(this.video.nativeElement.currentTime);
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
    }

    if (this.currentDrawingTool === "highLight") {
      if (
        Object.keys(this.canvasHighlightDrawing).length === 0 ||
        !this.pointInfoHiglight.isStartRecorded
      ) {
        this.pointInfoHiglight["isStartRecorded"] = true;
        this.pointInfoHiglight.startTime = Math.floor(
          this.video.nativeElement.currentTime
        );
        this.pointInfoHiglight.endTime = this.pointInfoHiglight.startTime;
        this.pointInfoHiglight.randomNum = Math.random();
        this.canvasHighlightDrawing[
          `${this.pointInfoHiglight.startTime} - ${this.pointInfoHiglight.randomNum} - ${this.pointInfoHiglight.endTime}`
        ] = [];
      } else {
        const oldEndTime = this.pointInfoHiglight.endTime;
        if (this.currentTime > this.pointInfoHiglight.endTime) {
          this.pointInfoHiglight.endTime = this.currentTime;
          Object.defineProperty(
            this.canvasHighlightDrawing,
            `${this.pointInfoHiglight.startTime} - ${this.pointInfoHiglight.randomNum} - ${this.pointInfoHiglight.endTime}`,
            Object.getOwnPropertyDescriptor(
              this.canvasHighlightDrawing,
              `${this.pointInfoHiglight.startTime} - ${this.pointInfoHiglight.randomNum} - ${oldEndTime}`
            )
          );
          delete this.canvasHighlightDrawing[
            `${this.pointInfoHiglight.startTime} - ${this.pointInfoHiglight.randomNum} - ${oldEndTime}`
          ];
        }
      }
    }

    if (this.currentDrawingTool === "annotate") {
      this.currentRenderObj = `${this.pointInfo.startTime} - ${this.pointInfo.randomNum} - ${this.pointInfo.endTime}`;
    }

    if (this.currentDrawingTool === "highLight") {
      this.currentRenderObj = `${this.pointInfoHiglight.startTime} - ${this.pointInfoHiglight.randomNum} - ${this.pointInfoHiglight.endTime}`;
    }

    if (this.currentDrawingTool === "annotate") {
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
      if (e.type == "mousedown") {
        this.isPainting = true;
        if (this.canvasHighlightDrawing[`${this.currentRenderObj}`]) {
          this.canvasHighlightDrawing[`${this.currentRenderObj}`].push(
            precentageAxisObj
          );
        }
        cancelAnimationFrame(this.timer);
        this.handleDraw(
          this.canvasHighlightDrawing[`${this.currentRenderObj}`]
        );
      } else {
        if (this.isPainting) {
          if (this.canvasHighlightDrawing[`${this.currentRenderObj}`]) {
            this.canvasHighlightDrawing[`${this.currentRenderObj}`].push(
              precentageAxisObj
            );
          }
          cancelAnimationFrame(this.timer);
          this.handleDraw(
            this.canvasHighlightDrawing[`${this.currentRenderObj}`]
          );
        }
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
      this.canvasHighlightDrawing[
        this.currentRenderObj
      ] = this.canvasHighlightDrawing[this.currentRenderObj].filter(
        (ele, i) => i % 2 === 0
      );
      this.pointInfoHiglight.endTime = null;
      this.pointInfoHiglight.startTime = null;
      this.pointInfoHiglight.randomNum = null;
      this.pointInfoHiglight.isStartRecorded = false;
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

  handleButtonToggle(e) {
    this.currentDrawingTool = e.value;
  }
}
