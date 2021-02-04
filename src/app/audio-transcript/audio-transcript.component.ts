import { Component, OnInit } from "@angular/core";
import { UserService } from "../auth/user-service.service";
import { AwsUploadService } from "../services/user/aws-upload.service";
import { KeyValue } from "@angular/common";
import Swal from "sweetalert2";

@Component({
  selector: "app-audio-transcript",
  templateUrl: "./audio-transcript.component.html",
  styleUrls: ["./audio-transcript.component.css"],
})
export class AudioTranscriptComponent implements OnInit {
  file: any = "";
  fileName: string = "";
  isLoading: boolean = false;
  videoTranscript;
  constructor(
    private userService: UserService,
    private awsUploadService: AwsUploadService
  ) {}

  ngOnInit(): void {}

  handleFileSelect(e) {
    this.file = e.target.files[0];
    this.fileName = `${e.target.files[0]["name"].split(".")[0]}`;
  }

  handleConvert = async () => {
    this.isLoading = true;
    const fileData = await this.awsUploadService.uploadToS3(this.file);
    const fileName = this.fileName;
    this.userService
      .getTranscript({ fileData: fileData["Location"], fileName })
      .subscribe(
        (data) => {
          this.videoTranscript = data;
          this.isLoading = false;
          console.log(data);
        },
        (error: any) => {
          Swal({
            type: "error",
            title: `Oops... ${error.error.name}!`,
            text: error.error.message,
          });
          console.error(`Error: ${error}`);
          this.isLoading = false;
          throw error;
        }
      );
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
