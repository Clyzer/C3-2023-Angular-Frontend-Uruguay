import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerModel } from './interfaces/customer.interface';
import { AccountModel } from './interfaces/account.interface';
import { DepositCreateModel } from './interfaces/deposit.create.interface';
import { DepositResponseModel } from './interfaces/deposit.response.interface';
import { environment } from '../environments/environment';
import { TransferCreateModel } from './interfaces/transfer.create.interface';
import { TransferResponseModel } from './interfaces/transfer.response.interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  baseurl = environment.apiUrl;

  constructor(public http: HttpClient) {}

  httpheaders = new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, GET',
      'Access-Control-Allow-Origin': '*'
  });

  getAllCustomers() : Observable<CustomerModel[]> {
    const httpOptions = {
      headers: this.httpheaders
    };
    return this.http.get<CustomerModel[]>(
      this.baseurl + "/customer/get-all",
      httpOptions
    );
  }

  getAllAccounts() : Observable<AccountModel[]> {
    const httpOptions = {
      headers: this.httpheaders
    };
    return this.http.get<AccountModel[]>(
      this.baseurl + "/account/get-all",
      httpOptions
    );
  }

  getAllAccountsByCustomerId(id: string) : Observable<AccountModel[]> {
    const httpOptions = {
      headers: this.httpheaders,
      params: new HttpParams().set("customer", id)
    };
    return this.http.get<AccountModel[]>(
      this.baseurl + "/account/get-by-customer-id",
      httpOptions
    );
  }

  getAllAccountsByDocument(document: string) : Observable<AccountModel[]> {
    const httpOptions = {
      headers: this.httpheaders,
      params: new HttpParams().set("document", document)
    };
    return this.http.get<AccountModel[]>(
      this.baseurl + "/account/get-by-customer-document",
      httpOptions
    );
  }

  getCustomerById(id: string): Observable<CustomerModel> {
    const httpOptions = {
      headers: this.httpheaders,
      params: new HttpParams().set("customer", id)
    };
    return this.http.get<CustomerModel>(
      this.baseurl + "/customer/get-by-id",
      httpOptions
    );
  }

  createDeposit(data: DepositCreateModel): Observable<DepositResponseModel> {
    const body = data;
    const httpOptions = {
      headers: this.httpheaders
    };
    return this.http.post<DepositResponseModel>(
      this.baseurl + "/deposit/create", body,
      httpOptions
    );
  }

  createTransfer(data: TransferCreateModel): Observable<TransferResponseModel> {
    const body = data;
    const httpOptions = {
      headers: this.httpheaders
    };
    return this.http.post<TransferResponseModel>(
      this.baseurl + "/transfer/create", body,
      httpOptions
    );
  }

  getDepositsHistory(id: string): Observable<DepositResponseModel[]> {
    const body = { id: id };
    const httpOptions = {
      headers: this.httpheaders
    };
    return this.http.post<DepositResponseModel[]>(
      this.baseurl + "/deposit/get-history", body,
      httpOptions
    );
  }

  getTransferHistory(id: string): Observable<TransferResponseModel[]> {
    const body = { id: id };
    const httpOptions = {
      headers: this.httpheaders
    };
    return this.http.post<TransferResponseModel[]>(
      this.baseurl + "/transfer/get-history", body,
      httpOptions
    );
  }

}
