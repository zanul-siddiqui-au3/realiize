import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { AdminTestService } from '../../../../services/admin/admintest.service';
@Component({
		selector: 'app-adminTestDetail',
		templateUrl: './admintest-detail.component.html',
		styleUrls: ['./admintest-detail.component.css']
})
export class AdminTestDetailComponent implements OnInit {
		STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
		objectKeys = Object.keys;
		test;
		constructor(private route: ActivatedRoute, public snackBar: MatSnackBar,  private admintestService: AdminTestService, ) {}

		ngOnInit() {
			this.route.params.subscribe(params => {
				this.admintestService.getOne(params['id'])
					.subscribe(structure => {
						this.test = { data: structure };
					},error => {
						Swal({
							type: 'error',
							title: `Oops... ${error.error.name}!`,
							text: error.error.message
						});
						throw error;
					});
			});
		}
		submit() {
			this.admintestService.update(this.test.data)
					.subscribe(structure => {
						Swal({
							type: 'success',
							title: 'Success!',
							text: 'Document has been updated successfully'
						}).then((result) => {
							this.test = structure;
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
        