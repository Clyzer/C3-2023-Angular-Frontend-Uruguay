import { Component, OnInit } from '@angular/core';
import { ErrorTypes } from 'src/app/interfaces/error-type.interface';
import { AccountModel } from '../../../interfaces/account.interface';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { UserDataService } from '../../services/user-data.service';
import { AccountTypeListModel } from 'src/app/interfaces/account.list.interface';
import { LastMovementsModel } from 'src/app/interfaces/last-movements.interface';
import { LastMovementsAccountService } from './last-movements-account.service';

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

  protected lastMovementsFinal: LastMovementsModel[] = [];

  accountTypes: AccountTypeListModel[] = [];
  accountTypeCurrent: string = "Ahorro";

  editAccountForm = this.formBuilder.group({
    accountType: new FormControl(0, Validators.required),
    monto: new FormControl(0, Validators.required)
  });

  constructor(private formBuilder: FormBuilder, protected userData: UserDataService, private api: ApiService, protected lastMovementsAccountService: LastMovementsAccountService){}

  ngOnInit(){
    this.accountTypes.push({value: "0", name: "Ahorro"});
    this.accountTypes.push({value: "1", name: "Corriente"});
    this.currentId = this.userData.get('currentAccount');
    this.currentColor = this.userData.get('currentColor');
    this.loadAccount();
    this.lastMovementsAccountService.lastMovementsFinalEmitter.subscribe({
      next: (data: LastMovementsModel[]) => {
        if (JSON.stringify(this.lastMovementsFinal) !== JSON.stringify(data.slice(0,8))) {
          this.lastMovementsFinal = data.slice(0,8);;
        }
      }
    })
  }

  loadAccount(){
    this.api.getAccountById(this.currentId).subscribe({
      next: (data) => { this.currentAccount = data; },
      complete: () => {
        let current = this.currentAccount;
        let finded = this.accountTypes.find((value) => value.name === current?.accountType.name);
        if (current && finded){
          this.editAccountForm.controls.accountType.setValue(+finded.value);
          this.editAccountForm.controls.monto.setValue(current.balance);
        }
      }
    });
  }

  onEditAccount(){
    if (this.editAccountForm.valid && this.currentAccount){
    this.api.editAccount({
      AccountId: this.currentAccount.id,
      customerId: this.currentAccount.customer.id,
      accountTypeName: this.accountTypes[this.editAccountForm.controls.accountType.value!].name,
      balance: this.editAccountForm.controls.monto.value!
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
