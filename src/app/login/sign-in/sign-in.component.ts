import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginResponseModel } from 'src/app/interfaces/login.response.interface';
import { ErrorTypes } from 'src/app/interfaces/error-type.interface';
import { UserDataService } from 'src/app/dashboard/services/user-data.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SigninComponent {
  show: boolean = true;
  error = {description: "error.description", state: false};

  signinForm = this.formBuilder.group({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
    remember: new FormControl(false, Validators.required)
  });

  constructor(private formBuilder: FormBuilder, private userData: UserDataService, private router: Router, private auth: AuthService) {}

  onSubmit(): void {
    if (this.signinForm.valid){
      let answer: LoginResponseModel;
      this.auth.login(this.signinForm.controls.email.value!, this.signinForm.controls.password.value!).subscribe({
        next: (value) => { answer = value; },
        error: () => { this.catchError(ErrorTypes.notfound) },
        complete: () => {
          this.error.state = false;
          (this.signinForm.controls.remember.value) ? this.userData.set('token', answer.token, true) : this.userData.set('token', answer.token);
          this.auth.loadCurrentUser();
          this.router.navigate(["/dashboard/view"]);
        }
      });
    } else {
      this.catchError(ErrorTypes.invalid)
    }
  }

  googleLogin() {
    this.auth.toGoogleLogin()
      .then(response => {
        let answer: LoginResponseModel;
        if (response.user.email){
          this.auth.loginGoogle(response.user.email).subscribe({
            next: (value) => { answer = value; },
            error: () => { this.catchError(ErrorTypes.notfound) },
            complete: () => {
              this.error.state = false;
              (this.signinForm.controls.remember.value) ? this.userData.set('token', answer.token, true) : this.userData.set('token', answer.token);
              this.auth.loadCurrentUser();
              this.router.navigate(["/dashboard/view"]);
            }
          });
        }
      })
      .catch(error => console.log(error))
  }

  redirect() {
    this.router.navigate(["/login/sign-up"]);
  }

  switchPassword(){
    this.show = !this.show;
  }

  catchError(error: ErrorTypes){
    this.error.state = true;
    this.error.description = error;
  }
}
