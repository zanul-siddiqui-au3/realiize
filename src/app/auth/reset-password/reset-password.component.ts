import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService} from '../user-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  email: string;
  reset = false;
  constructor(public snackBar: MatSnackBar, private fb: FormBuilder, private route: ActivatedRoute, private userService: UserService) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
    this.createForm();
  }

  ngOnInit() { }
  get confirmPassword() {
    return this.resetForm.get('confirmpassword');
  }
  createForm() {
    this.resetForm = this.fb.group({
      email: [this.email, Validators.required],
      password: [null, Validators.required],
      confirmpassword: [null, [Validators.required, this.passwordConfirming]]
    });
  }
  passwordConfirming(confirmedPassword: AbstractControl): any {
    if (!confirmedPassword.parent || !confirmedPassword) {
      return;
    }
    const pwd = confirmedPassword.parent.get('password');
    const confirmPassword = confirmedPassword.parent.get('confirmpassword');

    if (!pwd || !confirmPassword) {
      return;
    }
    if (pwd.value !== confirmPassword.value) {
      return { invalid: true };

    }
  }

  onSubmit() {
    this.userService.resetPassword(this.resetForm.value).subscribe(
      (user) => {
        this.email = user.email;
        this.reset = true;
      },
      (err) => {
        this.snackBar.open(err.message, '', {
          duration: 2000,
        });
      }
    );
  }
}
