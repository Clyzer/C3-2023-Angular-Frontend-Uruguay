import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Observable, Subject } from 'rxjs';
import { JwtTokenModel } from 'src/app/interfaces/token.interface';
import { LoginResponseModel } from 'src/app/interfaces/login.response.interface';
import { CustomerModel } from 'src/app/interfaces/customer.interface';
import { SignInModel } from 'src/app/interfaces/signin.interface';
import { UserDataService } from 'src/app/dashboard/services/user-data.service';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: LoginResponseModel | undefined;
  currentUserEmitter: Subject<LoginResponseModel> = new Subject<LoginResponseModel>();

  constructor(private api: ApiService, private userData: UserDataService, private gauth: Auth) {
    this.currentUserEmitter.subscribe((value) => this.currentUser = value);
    this.loadCurrentUser();
  }

  isValid(token: string): Observable<JwtTokenModel> {
    const httpOptions = {
      headers: this.api.httpheaders,
      params: new HttpParams().set("jwtToken", token)
    };
    return this.api.http.get<JwtTokenModel>(
      this.api.baseurl + "/security/is-valid",
      httpOptions
    )
  }

  signUp(data: SignInModel): Observable<LoginResponseModel> {
    const body = data;
    const httpOptions = {
      headers: this.api.httpheaders
    };
    return this.api.http.post<LoginResponseModel>(
      this.api.baseurl + "/security/sign-up", body,
      httpOptions
    );
  }

  login(mail: string, pass: string): Observable<LoginResponseModel> {
    const body = { email: mail, password: pass };
    const httpOptions = {
      headers: this.api.httpheaders
    };
    return this.api.http.post<LoginResponseModel>(
      this.api.baseurl + "/security/sign-in", body,
      httpOptions
    );
  }

  loginGoogle(email: string): Observable<LoginResponseModel> {
    const httpOptions = {
      headers: this.api.httpheaders,
      params: new HttpParams().set("email", email)
    };
    return this.api.http.get<LoginResponseModel>(
      this.api.baseurl + "/security/sign-in-google",
      httpOptions
    );
  }

  toGoogleLogin() {
    return signInWithPopup(this.gauth, new GoogleAuthProvider());
  }

  loadCurrentUser(): void {
    let user: CustomerModel;
    if (this.userData.check('token')){
      const token: string = this.userData.get('token');
      this.isValid(token).subscribe({
        next:(value) => {
          this.api.getCustomerById(value.customer.id).subscribe({
            next: (data) => { user = data; },
            complete: () => { this.currentUserEmitter.next({ customer: user, token: token }); }
          });
        }
      });
    }
  }

  reloadCurrentUser(): void {
    let user: CustomerModel;
    const token: string = this.userData.get('token');
    this.api.getCustomerById(this.currentUser!.customer.id).subscribe({
      next: (data) => { user = data; },
      complete: () => { this.currentUserEmitter.next({ customer: user, token: token }); }
    });
  }
}
