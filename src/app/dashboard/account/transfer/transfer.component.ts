import { Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { AccountModel } from 'src/app/interfaces/account.interface';
import { UserDataService } from '../../services/user-data.service';
import { DepositService } from '../deposit/deposit.service';
import { BehaviorSubject } from 'rxjs';
import { InfoTypes } from 'src/app/interfaces/info-type.interface';
import { ErrorTypes } from 'src/app/interfaces/error-type.interface';
import { ReasonTypes } from 'src/app/interfaces/reason-type.interface';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent {

  AccountsListOfUser: AccountModel[] = [];
  UserAccountsList: AccountModel[] = [];
  Reasons: string[] = this.reasonType.ReasonTypes;
  public AccountsListOfUserEmitter: BehaviorSubject<AccountModel[]> = new BehaviorSubject<AccountModel[]>(this.AccountsListOfUser);

  show: boolean = true;
  error = {description: "error.description", state: false};
  info = {description: "info.description", state: false};

  transferForm = this.formBuilder.group({
    accounts: new FormControl("0"),
    accountto: new FormControl("0"),
    documento: new FormControl(),
    monto: new FormControl(),
    reason: new FormControl("0")
  });

  constructor(private api: ApiService, private formBuilder: FormBuilder, protected userData: UserDataService, private depositService: DepositService, private reasonType: ReasonTypes) {}

  ngOnInit(): void {

    this.depositService.userAccountsEmitter.subscribe((data: AccountModel[]) => {
      if (JSON.stringify(this.UserAccountsList) !== JSON.stringify(data)) this.UserAccountsList = data;
    });
    this.depositService.updateUserAccountsTable();

    this.AccountsListOfUserEmitter.subscribe((data: AccountModel[]) => { this.AccountsListOfUser = data; })
    this.transferForm.get("documento")?.valueChanges.subscribe(documento => {
      if (documento !== null && documento.toString().length >= 8 && this.transferForm.controls.documento.valid){
        this.api.getAllAccountsByDocument(documento).subscribe({
          next: (data) => {
            if (this.AccountsListOfUser !== data) {
              this.AccountsListOfUser = data;
              this.AccountsListOfUserEmitter.next(this.AccountsListOfUser);
              this.error.state = false;
              this.info.state = false;
            }
          },
          complete: () => { if (this.AccountsListOfUser.length === 0 ) this.catchError( ErrorTypes.notexist ) }
        });
      } else this.AccountsListOfUser = [];
   })
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

  onSubmit() {
    if (this.transferForm.valid && +this.transferForm.controls.monto.value > 0){
      const monto = +this.transferForm.controls.monto.value;
      if (this.transferForm.controls.accounts.value && this.transferForm.controls.accountto.value && this.transferForm.controls.reason.value){
        const account = this.UserAccountsList[+this.transferForm.controls.accounts.value].id;
        const accountTo = this.AccountsListOfUser[+this.transferForm.controls.accountto.value].id;
        const reason = this.Reasons[+this.transferForm.controls.reason.value];
        if (account && accountTo && (account != accountTo)){
          this.api.createTransfer({ outcomeId: account, incomeId: accountTo, balance: monto, reason: reason }).subscribe({
            next: () => {},
            complete: () => {
              this.error.state = false;
              this.catchInfo(InfoTypes.createTransfer);
            }
          })
        } else this.catchError(ErrorTypes.duplicated);
      } else this.catchError(ErrorTypes.invalid);
    } else this.catchError(ErrorTypes.morethan0);
  }

}
