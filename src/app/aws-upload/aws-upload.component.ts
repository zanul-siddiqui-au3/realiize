import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AwsUploadService } from '../aws-upload.service';


@Component({
  selector: 'app-aws-upload',
  templateUrl: './aws-upload.component.html',
  styleUrls: ['./aws-upload.component.scss']
})
export class AwsUploadComponent implements OnInit {

  files: any[] = [];
  
  constructor(private awsUploadService : AwsUploadService) { }

  ngOnInit(): void {
  }
  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

    /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      item.isUploadCompleted = false;
      item.uploadLocation = '';
      this.files.push(item);
    }
  }


  async uploadFilesSimulator  () {
    try {
      for(let i = 0 ; i < this.files.length ; i++){
        this.awsUploadService.uploadToS3Percent(this.files[i] , (evt)=>{
        if(!this.files[i].isUploadCompleted){
          this.files[i].progress = (evt.loaded * 100) / evt.total;
          console.log((evt.loaded * 100) / evt.total);
          if(this.files[i].progress == 100){
            this.files[i].isUploadCompleted = true;
          }
        }
      }).then((data)=>{
          const {Location} = data;
          this.files[i].uploadLocation= Location;
      }).catch((error)=>{
        this.files[i].isUploadCompleted= false;
        throw error
      })
      }

    } catch (error) {
      throw error;
    }
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  
  deleteFile(index){
    this.files = this.files.filter((ele ,  i)=> i !== index);
  }
}
