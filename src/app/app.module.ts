import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './login/login.module';
import { MaterialModule } from './material/material.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AccountModule } from './dashboard/account/account.module';
import { PageNotFoundModule } from './404/page-not-found.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    LoginModule,
    DashboardModule,
    AccountModule,
    PageNotFoundModule,
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent],
  exports: [
    AppComponent
  ]
})
export class AppModule { }
