import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { AccountModel } from 'src/app/interfaces/account.interface';
import { ErrorTypes } from 'src/app/interfaces/error-type.interface';
import { InfoTypes } from 'src/app/interfaces/info-type.interface';
import { DepositService } from './deposit.service';
import { ApiService } from 'src/app/api.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  UserAccountsList: AccountModel[] = [];

  show: boolean = true;
  error = {description: "error.description", state: false};
  info = {description: "info.description", state: false};

  depositForm = this.formBuilder.group({
    account: new FormControl("0"),
    monto: new FormControl("")
  });

  constructor(private formBuilder: FormBuilder, protected userData: UserDataService, private depositService: DepositService, private api: ApiService) {}

  ngOnInit(): void {
    this.depositService.userAccountsEmitter.subscribe((data: AccountModel[]) => { if (JSON.stringify(this.UserAccountsList) !== JSON.stringify(data)) this.UserAccountsList = data });
    this.depositService.updateUserAccountsTable();

  }

  catchInfo(info: InfoTypes){
    this.error.state = false;
    this.info.state = true;
    this.info.description = info;
  }

  catchError(error: ErrorTypes){
    this.info.state = false;
    this.error.state = true;
    this.error.description = error;
  }

  onSubmit(): void {
    if(this.depositForm.controls.monto.value && (this.depositForm.controls.account.value || this.userData.check("currentAccount"))){
      let account: string = "";
      if (this.depositForm.controls.account.value) account = this.UserAccountsList[+this.depositForm.controls.account.value].id;
      if (this.userData.check("currentAccount")) account = this.userData.get("currentAccount");
      if (typeof +this.depositForm.controls.monto.value == "number" && +this.depositForm.controls.monto.value > 0 && account){
        this.api.createDeposit({ accountId: account, balance: +this.depositForm.controls.monto.value}).subscribe({
          error: () => { this.catchError( ErrorTypes.notfound) },
          complete: () => { this.catchInfo( InfoTypes.createDeposit) }
        })
      } else this.catchError(ErrorTypes.morethan0);
    } this.catchError(ErrorTypes.invalid);
  }
}
