import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap , Router} from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { AdminTestService } from '../../../../services/admin/admintest.service';
import { Test } from '../../../../../../shared/models/Test';
;
@Component({
		selector: 'app-adminTestCreateEdit',
		templateUrl: './admintest-create-edit.component.html',
		styleUrls: ['./admintest-create-edit.component.css']
})
export class AdminTestCreateEditComponent implements OnInit {
		STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
		objectKeys = Object.keys;
    test :Test = {"invoice":""};
    mode;
    
		constructor(private route: ActivatedRoute, public snackBar: MatSnackBar,  private router : Router ,  private admintestService: AdminTestService, ) {}
    redirectRouteArr;
    filteredRouteArr;
    redirectUrl;
		ngOnInit() {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        if (paramMap.has('id')) {
            this.mode = 'EDIT';
            this.admintestService
                .getOne(paramMap.get('id'))
                .subscribe(
                    (data) => {
                        this.test = data[0];
                    }
                );
        } else {
            this.mode = 'CREATE';
        }
        this.redirectRouteArr = this.router.url.split('/');
        this.filteredRouteArr = this.redirectRouteArr.slice(1, -1);
        this.redirectUrl = '/' + this.filteredRouteArr.join('/');
    });
		}
		submit() {
      if(this.mode === 'EDIT') {
        this.admintestService.update(this.test)
        .subscribe(data => {
          this.router.navigate([this.redirectUrl]);
          Swal({
            type: 'success',
            title: 'Success!',
            text: 'Document has been updated successfully'
          }).then((result) => {
            this.test = data;
          });
        },error => {
          Swal({
            type: 'error',
            title: `Oops... ${error.error.name}!`,
            text: error.error.message
          });
          throw error;
        });
      }
      else if(this.mode === 'CREATE') {
        console.log(this.test);
        this.admintestService.create(this.test)
        .subscribe(data => {
          this.router.navigate([this.redirectUrl]);
          Swal({
            type: 'success',
            title: 'Success!',
            text: 'Document has been created successfully'
          }).then((result) => {
            this.test = data;
          });
        },error => {
          Swal({
            type: 'error',
            title: `Oops... ${error.error.name}!`,
            text: error.error.message
          });
          throw error;
        });
      }
  }
}
        