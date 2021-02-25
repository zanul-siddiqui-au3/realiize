import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { faHighlighter } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-atrament-video-editor",
  templateUrl: "./atrament-video-editor.component.html",
  styleUrls: ["./atrament-video-editor.component.css"],
})
export class AtramentVideoEditorComponent implements OnInit {
  @ViewChild("videoRef", { static: true }) video: ElementRef;
  @ViewChild("canvasRef", { static: true }) canvas: ElementRef;
  @ViewChild("mainContainer", { static: true }) mainContainer: ElementRef;

  highlighterIcon = faHighlighter;

  drawingSizeOptions = [
    {
      strokeLength: 5,
    },
    {
      strokeLength: 10,
    },
    {
      strokeLength: 15,
    },
    {
      strokeLength: 20,
    },
  ];

  drawingSizeOptionDefault = [
    {
      strokeLength: 10,
    },
  ];

  drawingDetails = {
    strokeLength: 5,
    strokeColor: "black",
  };

  commentTimeStampObj = {};

  commentText: string = "";

  videoObserver;

  videoObservable;

  currentVideoDuration;

  canvasDrawing = {};

  canvasHighlightDrawing = {};

  currentDrawingTool: string = "";

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

  videoStatus = {
    playStatus: "pause",
    volume: 0.7,
    currentTime: 0,
    totalTime: 0,
    isNotFullScreen: true,
    isEnded: false,
  };

  videoDetails = {
    videoTranscript: {
      "0 - 1": "make",
      "1 - 2": "your English sound",
      "2 - 3": "more natural will",
      "3 - 4": "learn some expressions",
      "4 - 5": "for basic",
      "5 - 6": "conversation",
      "6 - 7": "if",
      "7 - 8": "you want to greet someone in",
      "8 - 9": "a formal",
      "9 - 10": "way you can",
      "10 - 11": "say hello",
      "11 - 12": "good",
      "12 - 13": "morning good",
      "13 - 14": "afternoon good",
      "15 - 16": "evening",
      "16 - 17": "note",
      "17 - 18": "the good night is",
      "18 - 19": "only used when",
      "19 - 20": "going to bed so",
      "20 - 21": "you would never use it in a",
      "21 - 22": "formal situation",
      "23 - 24": "to greet",
      "24 - 25": "someone informally",
      "25 - 26": "you could say",
      "26 - 27": "hi hey",
      "27 - 28": "hey there",
      "28 - 29": "how's",
      "29 - 30": "it going",
      "30 - 31": "what's up",
      "32 - 33": "how",
      "33 - 34": "are you",
      "34 - 35": "do English",
      "35 - 36": "speakers especially",
      "36 - 37": "Americans will",
      "37 - 38": "usually say",
      "38 - 39": "how are you as",
      "39 - 40": "part of every conversation",
      "41 - 42": "they're not",
      "42 - 43": "really asking how",
      "43 - 44": "you are it's",
      "44 - 45": "just part of the greeting",
      "45 - 46": "so",
      "46 - 47": "give only",
      "47 - 48": "a short answer",
      "49 - 50": "ways",
      "50 - 51": "to say how are you could",
      "51 - 52": "be how",
      "52 - 53": "are you how",
      "53 - 54": "are you doing how's",
      "54 - 55": "it",
      "55 - 56": "going how",
      "56 - 57": "have you been what",
      "57 - 58": "sup",
      "58 - 59": "or sup",
      "60 - 61": "you",
      "61 - 62": "can respond by saying",
      "62 - 63": "good",
      "63 - 64": "things and",
      "64 - 65": "you great",
      "65 - 66": "find",
      "66 - 67": "thanks pretty",
      "67 - 68": "good",
      "68 - 69": "all right",
      "70 - 71": "so",
      "71 - 72": "note that all these answers",
      "72 - 73": "are short",
      "74 - 75": "if",
      "75 - 76": "someone says what's up",
      "76 - 77": "usually",
      "77 - 78": "you would say",
      "78 - 79": "not much nothing",
      "80 - 81": "not a",
      "81 - 82": "whole lot",
      "82 - 83": "you're",
      "83 - 84": "going to sample of",
      "84 - 85": "a conversation",
      "85 - 86": "hello",
      "86 - 87": "hi",
      "87 - 88": "how's",
      "88 - 89": "it going",
      "89 - 90": "good",
      "90 - 91": "and you",
      "91 - 92": "fine",
      "92 - 93": "thanks great",
      "96 - 97": "here's",
      "97 - 98": "another one hey",
      "98 - 99": "hey there",
      "100 - 101": "what's",
      "101 - 102": "up not",
      "102 - 103": "much you",
      "103 - 104": "nothing",
      "106 - 107": "introduce",
      "107 - 108": "yourself give",
      "108 - 109": "your name",
      "109 - 110": "I'm",
      "110 - 111": "and",
      "111 - 112": "say your name",
      "112 - 113": "your",
      "113 - 114": "response is nice",
      "114 - 115": "to meet you",
      "117 - 118": "for example",
      "118 - 119": "I'm",
      "119 - 120": "Eva nice",
      "121 - 122": "to meet you Eva I'm",
      "122 - 123": "Janelle nice",
      "123 - 124": "to meet",
      "124 - 125": "you",
      "126 - 127": "after",
      "127 - 128": "saying hi an",
      "128 - 129": "introduction you",
      "129 - 130": "can just continue the",
      "130 - 131": "conversation",
      "132 - 133": "for",
      "133 - 134": "someone you don't",
      "134 - 135": "know you can ask",
      "135 - 136": "what do you do",
      "137 - 138": "that means",
      "138 - 139": "what they",
      "139 - 140": "spend most of their time doing",
      "142 - 143": "for example",
      "144 - 145": "what do you",
      "145 - 146": "do I",
      "146 - 147": "work in a bank and",
      "147 - 148": "you I'm",
      "149 - 150": "a student OIC",
      "153 - 154": "what do",
      "154 - 155": "you do I",
      "155 - 156": "work in a",
      "156 - 157": "restaurant and",
      "157 - 158": "you",
      "158 - 159": "I stay",
      "159 - 160": "home with my kids oh",
      "160 - 161": "okay",
      "163 - 164": "when someone is talking",
      "164 - 165": "to you you",
      "165 - 166": "can use these words",
      "166 - 167": "to show interest",
      "167 - 168": "in the conversation",
      "169 - 170": "for instance",
      "170 - 171": "really",
      "171 - 172": "how",
      "172 - 173": "interesting",
      "173 - 174": "o",
      "174 - 175": "i",
      "175 - 176": "c o",
      "176 - 177": "okay",
      "179 - 180": "or if you want to show",
      "180 - 181": "someone that you agree",
      "181 - 182": "with what they're saying",
      "183 - 184": "right oh",
      "184 - 185": "definitely",
      "185 - 186": "naturally",
      "188 - 189": "yeah",
      "189 - 190": "for sure",
      "192 - 193": "when someone",
      "193 - 194": "is talking to you and",
      "194 - 195": "you want to react",
      "195 - 196": "to something they said",
      "196 - 197": "that's happy you",
      "197 - 198": "can say",
      "198 - 199": "oh that's",
      "199 - 200": "great how",
      "200 - 201": "nice wow",
      "201 - 202": "really",
      "202 - 203": "I'm",
      "203 - 204": "happy to hear that",
      "205 - 206": "if somebody is",
      "206 - 207": "telling you a funny or",
      "207 - 208": "amusing story",
      "208 - 209": "you can say",
      "209 - 210": "oh",
      "210 - 211": "that's too",
      "211 - 212": "funny that's",
      "212 - 213": "hysterical that",
      "214 - 215": "cracks me up",
      "216 - 217": "if someone is telling",
      "217 - 218": "you a surprising",
      "218 - 219": "or shocking",
      "219 - 220": "or",
      "220 - 221": "unexpected story",
      "221 - 222": "you can say",
      "222 - 223": "no",
      "223 - 224": "way really",
      "224 - 225": "seriously",
      "226 - 227": "that's",
      "227 - 228": "unreal",
      "229 - 230": "if someone is telling",
      "230 - 231": "you a sad",
      "231 - 232": "or upsetting",
      "232 - 233": "story you",
      "233 - 234": "can say oh",
      "234 - 235": "no",
      "235 - 236": "really",
      "236 - 237": "that's",
      "237 - 238": "too bad that's",
      "238 - 239": "a shame",
      "239 - 240": "I'm",
      "240 - 241": "sorry to hear that",
      "242 - 243": "for example",
      "244 - 245": "I'm",
      "245 - 246": "studying Finance",
      "246 - 247": "really",
      "247 - 248": "I",
      "248 - 249": "will graduate",
      "249 - 250": "next month oh",
      "250 - 251": "that's great",
      "253 - 254": "my car broke",
      "254 - 255": "down oh",
      "255 - 256": "no really",
      "256 - 257": "it",
      "257 - 258": "will cost a lot",
      "258 - 259": "to fix that's",
      "259 - 260": "too",
      "260 - 261": "bad",
      "261 - 262": "so",
      "262 - 263": "when you're ready to",
      "263 - 264": "end the conversation and",
      "264 - 265": "you want to go",
      "265 - 266": "you",
      "266 - 267": "can introduce the",
      "267 - 268": "fact that you're ready",
      "268 - 269": "to go you",
      "269 - 270": "do it by saying",
      "270 - 271": "something like I'd",
      "271 - 272": "better be",
      "272 - 273": "on my way I've",
      "273 - 274": "got to get going",
      "274 - 275": "well",
      "275 - 276": "I'm off",
      "276 - 277": "Tinder",
      "277 - 278": "conversation",
      "278 - 279": "in a formal setting",
      "279 - 280": "and to be polite",
      "280 - 281": "for",
      "281 - 282": "someone you've just",
      "282 - 283": "met you say",
      "283 - 284": "it",
      "284 - 285": "was nice meeting you",
      "285 - 286": "the",
      "286 - 287": "response would be same",
      "287 - 288": "to you",
      "289 - 290": "if you're saying goodbye",
      "290 - 291": "to someone you know",
      "291 - 292": "who you've been talking",
      "292 - 293": "to for",
      "293 - 294": "instance a",
      "294 - 295": "work colleague or",
      "295 - 296": "a",
      "296 - 297": "friend you don't know",
      "297 - 298": "very well you",
      "298 - 299": "could say it",
      "299 - 300": "was nice seeing",
      "300 - 301": "you it",
      "301 - 302": "was nice",
      "302 - 303": "talking to you always",
      "304 - 305": "nice to see you",
      "306 - 307": "the response",
      "307 - 308": "would be likewise",
      "308 - 309": "same",
      "309 - 310": "to you",
      "310 - 311": "actually",
      "311 - 312": "say goodbye say",
      "312 - 313": "goodbye",
      "313 - 314": "see",
      "315 - 316": "you talk",
      "317 - 318": "to you later take",
      "318 - 319": "it easy",
      "319 - 320": "or have",
      "320 - 321": "a nice day have",
      "322 - 323": "a nice day is really",
      "323 - 324": "used only for",
      "324 - 325": "formal situations",
      "325 - 326": "where you don't",
      "326 - 327": "know someone very well",
      "328 - 329": "for example",
      "330 - 331": "alright I",
      "331 - 332": "better go oh",
      "332 - 333": "okay see",
      "333 - 334": "you later",
      "334 - 335": "take",
      "335 - 336": "care",
      "336 - 337": "it was nice",
      "337 - 338": "seeing you same",
      "338 - 339": "here talk",
      "339 - 340": "to",
      "340 - 341": "you later bye",
      "341 - 342": "we",
      "342 - 343": "hope this video",
      "343 - 344": "is useful to",
      "344 - 345": "you if",
      "345 - 346": "you liked it please click like",
      "346 - 347": "And subscribe",
      "347 - 348": "you can check",
      "348 - 349": "out more videos from",
      "349 - 350": "education World",
      "350 - 351": "here",
    },
    captions: "",
    captionClosed: true,
  };

  timer;

  count = 1;

  highLighterTimer;

  volumeSliderInfo = {
    isShown: false,
  };

  editOptionInfo = {
    isShown: false,
  };

  constructor() {}

  ngOnInit(): void {
    this.madeVideoObserver();
    this.subscribeVideoObserver();
  }

  ngAfterViewInit() {
    this.canvasCtx = this.canvas.nativeElement.getContext("2d");
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
      (xAxis / this.canvas.nativeElement.clientWidth) * 100;
    precentageAxisObj["y-axis"] =
      (yAxis / this.canvas.nativeElement.clientHeight) * 100;
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
      this.canvasCtx.lineWidth = obj["stroke-length"];
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
      const newKey = `${Math.floor(
        parseFloat(this.currentVideoDuration)
      )} - ${Math.ceil(parseFloat(this.currentVideoDuration))}`;
      if (this.videoDetails.videoTranscript[newKey]) {
        this.videoDetails.captions = this.videoDetails.videoTranscript[newKey];
      }
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
    }
  }

  handleButtonToggle(value) {
    this.currentDrawingTool = value;
  }

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
    if (time.toString().includes(":")) {
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
    } else {
      return time;
    }
  }

  handleRedirectVideo(key) {
    let timeInSeconds = this.convertIntoSeconds(key);
    this.video.nativeElement.currentTime = timeInSeconds;
  }

  handleVolumeOver() {
    this.volumeSliderInfo.isShown = true;
  }

  handleCanvasMouseOver() {
    this.volumeSliderInfo.isShown = false;
  }

  handleToogle() {
    this.editOptionInfo.isShown = !this.editOptionInfo.isShown;
  }

  handleAddBookMark() {
    Swal({
      title: "Bookmark",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Add",
    }).then(({ value }) => {
      if (value === "") {
        Swal({
          type: "error",
          title: ``,
          text: `Comment cannot be empty`,
        });
        return false;
      }
      if (value && value.length > 0) {
        this.commentText = value;
        this.handleAddComment();
      }
    });
  }

  handleChangeStorkeLength(strokeLength) {
    this.drawingDetails.strokeLength = strokeLength;
  }
}
