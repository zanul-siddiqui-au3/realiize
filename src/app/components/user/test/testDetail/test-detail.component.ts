import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { TestService } from '../../../../services/user/test.service';
@Component({
		selector: 'app-test-detail',
		templateUrl: './test-detail.component.html',
		styleUrls: ['./test-detail.component.css']
})
export class TestDetailComponent implements OnInit {
		STANDARD_DATE_FORMAT = 'YYYY-MM-DD';
		objectKeys = Object.keys;
		test;
		constructor(private route: ActivatedRoute, public snackBar: MatSnackBar,  private testService: TestService, ) {}

		ngOnInit() {
			this.route.params.subscribe(params => {
				this.testService.getOne(params['id'])
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
			this.testService.update(this.test.data)
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
        