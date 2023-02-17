import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { DocumentTypeListModel } from 'src/app/interfaces/document.list.interface';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginResponseModel } from 'src/app/interfaces/login.response.interface';
import { ErrorTypes } from 'src/app/interfaces/error-type.interface';
import { AccountTypeListModel } from 'src/app/interfaces/account.list.interface';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignupComponent {
  show: boolean = true;
  error = {description: "error.description", state: false};

  documentTypes: DocumentTypeListModel[] = [];
  documentTypeCurrent: string = "cedula de identidad";

  accountTypes: AccountTypeListModel[] = [];
  accountTypeCurrent: string = "Ahorro";

  signupForm = this.formBuilder.group({
    name: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    documentType: new FormControl(0, Validators.required),
    document: new FormControl("", Validators.required),
    phone: new FormControl("", Validators.required),
    accountType: new FormControl(0, Validators.required),
    password: new FormControl("", Validators.required),
    password_confirmation: new FormControl("", Validators.required),
    read: new FormControl(false, Validators.required)
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private auth: AuthService) {}

  onSubmit(): void {
    if (this.signupForm.valid && this.signupForm.controls.read.value === true){
      let answer: LoginResponseModel;
      this.auth.signUp({
        documentTypeName: this.documentTypes[this.signupForm.controls.documentType.value || 0].name,
        accountTypeName: this.accountTypes[this.signupForm.controls.accountType.value || 0].name,
        balance: 0,
        document: this.signupForm.controls.document.value!,
        fullName: this.signupForm.controls.name.value!,
        email: this.signupForm.controls.email.value!,
        phone: +this.signupForm.controls.phone.value!,
        password: this.signupForm.controls.password.value!,
        avatarUrl: "https://yt3.googleusercontent.com/ytc/AL5GRJX6gCqBAFFK_NY2PxdEr8dSSc-mF0052JzeIDJV=s900-c-k-c0x00ffffff-no-rj"
      }).subscribe({
        next: (value) => { answer = value; },
        error: () => { this.catchError(ErrorTypes.alredyexist) },
        complete: () => {
          this.error.state = false;
          sessionStorage.setItem('token', answer.token);
          this.auth.loadCurrentUser();
          this.router.navigate(["/dashboard/view"]);
        }
      })
    } else this.catchError(ErrorTypes.invalid)
  }

  redirect(url: string) {
    this.router.navigate(["/" + url]);
  }

  catchError(error: ErrorTypes){
    this.error.state = true;
    this.error.description = error;
  }

  ngOnInit() {
    this.documentTypes.push({value: "0", name: "Cedula de identidad"});
    this.documentTypes.push({value: "1", name: "Pasaporte"});
    this.documentTypes.push({value: "2", name: "Libreta de conducir"});
    this.accountTypes.push({value: "0", name: "Ahorro"});
    this.accountTypes.push({value: "1", name: "Corriente"});
  }

  switchPassword(){
    this.show = !this.show;
  }

  switchDocumentType(value: number){
    this.documentTypeCurrent = this.documentTypes[value].name.toLowerCase();
  }

  switchAccountType(value: number){
    this.accountTypeCurrent = this.accountTypes[value].name.toLowerCase();
  }

}
