import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';

const URL = '/api/file/upload';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent implements OnInit {
  public uploader: FileUploader = null;
  filename: any;
  constructor() {}

  ngOnInit() {
    this.setupFileUploader();
  }

  private setupFileUploader(): void {
    this.uploader = new FileUploader({
      url: URL,
      method: 'POST',
      autoUpload: false,
    });

    this.uploader.onCompleteItem = (item, response, status) => {
      this.uploader.clearQueue();
    };

    this.uploader.onErrorItem = (item, response, status) => {
      Swal('Error!', 'Unable to upload the document.', 'error');
    };
  }

  public upload(): void {
    this.uploader.uploadAll();
  }
}
