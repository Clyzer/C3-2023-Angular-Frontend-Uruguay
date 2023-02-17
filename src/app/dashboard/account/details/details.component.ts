import { Component, OnInit } from '@angular/core';
import { ErrorTypes } from 'src/app/interfaces/error-type.interface';
import { AccountModel } from '../../../interfaces/account.interface';
import { FormBuilder } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { UserDataService } from '../../services/user-data.service';
import { AccountTypeListModel } from 'src/app/interfaces/account.list.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  editor: boolean = false;
  error = {description: "error.description", state: false};
  info = {description: "info.description", state: false};
  currentAccount: AccountModel | undefined;
  currentColor: string = "";
  currentId: string = "";

  accountTypes: AccountTypeListModel[] = [];
  accountTypeCurrent: string = "Ahorro";

  editAccountForm = this.formBuilder.group({
    accountType: 0
  });

  constructor(private formBuilder: FormBuilder, private router: Router, protected userData: UserDataService, private api: AppService){}

  ngOnInit(){
    this.accountTypes.push({value: "0", name: "Ahorro"});
    this.accountTypes.push({value: "1", name: "Corriente"});
    this.currentId = this.userData.get('currentAccount');
    this.currentColor = this.userData.get('currentColor');
    this.loadAccount();
  }

  loadAccount(){
    this.api.getAccountById(this.currentId).subscribe({
      next: (data) => { this.currentAccount = data; },
      complete: () => {
        let current = this.currentAccount?.accountType.name;
        let finded = this.accountTypes.find((value) => value.name === current);
        if (current && finded){
          this.editAccountForm.controls.accountType.setValue(+finded.value)
        }
      }
    });
  }

  onEditAccount(){
    if (this.editAccountForm.valid && this.currentAccount){
    this.api.editAccount({
      AccountId: this.currentAccount.id,
      customerId: this.currentAccount.customer.id,
      accountTypeName: this.accountTypes[this.editAccountForm.controls.accountType.value || 0].name,
      balance: this.currentAccount.balance
    }).subscribe({
      error: () => { this.catchError(ErrorTypes.alredyexist) },
      complete: () => {
        this.error.state = false;
        this.loadAccount();
        this.toEdit();
      }
    });
    }
  }

  catchError(error: ErrorTypes){
    this.info.state = false;
    this.error.state = true;
    this.error.description = error;
  }

  switchAccountType(value: number){
    this.accountTypeCurrent = this.accountTypes[value].name.toLowerCase();
  }

  toEdit() {
    this.editor = !this.editor;
  }

}
