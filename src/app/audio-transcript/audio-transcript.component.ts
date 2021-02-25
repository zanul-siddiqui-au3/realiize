import { Component, OnInit } from "@angular/core";
import { AwsUploadService } from "../services/user/aws-upload.service";
import { KeyValue } from "@angular/common";
import Swal from "sweetalert2";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { UserService } from "../auth/user-service.service";

@Component({
  selector: "app-audio-transcript",
  templateUrl: "./audio-transcript.component.html",
  styleUrls: ["./audio-transcript.component.css"],
})
export class AudioTranscriptComponent implements OnInit {
  file: any = "";
  fileName: string = "";
  isLoading: boolean = false;
  fullFileName: string = "";
  fileType: string = "";
  videoTranscript;
  constructor(
    private awsUploadService: AwsUploadService,
    private userService: UserService
  ) {}

  awsUrl: string = "";

  ngOnInit(): void {}

  handleFileSelect(e) {
    this.file = e.target.files[0];
    this.fileName = `${e.target.files[0]["name"].split(".")[0]}`;
    this.fullFileName = e.target.files[0]["name"];
    this.fileType = e.target.files[0]["type"];
  }

  handleConvert = async () => {
    this.isLoading = true;
    this.awsUploadService
      .getSignedUrlS3(this.fullFileName, this.fileType)
      .subscribe(({ url, keyFile }) => {
        this.awsUploadService
          .uploadfileAWSS3(url, this.fileType, this.file)
          .subscribe(
            (data) => {
              if (data["type"] === 4) {
                this.awsUrl = `https://${environment.S3_BUCKET_NAME}.s3.${environment.S3_Region}.amazonaws.com/${keyFile}`;
                this.userService
                  .getTranscript({
                    fileData: keyFile,
                    fileName: this.fileName,
                  })
                  .subscribe(
                    (data) => {
                      this.videoTranscript = data;
                      this.isLoading = false;
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
}
