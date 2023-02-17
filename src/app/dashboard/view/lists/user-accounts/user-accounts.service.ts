import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, asyncScheduler } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AccountModel } from 'src/app/interfaces/account.interface';
import { AuthService } from '../../../../login/services/auth.service';
import { AuthGuard } from 'src/app/login/guards/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class UserAccountsService implements OnDestroy {

  protected newUserDataAccounts: AccountModel[] = [];
  public userAccountsEmitter: BehaviorSubject<AccountModel[]> = new BehaviorSubject<AccountModel[]>(this.newUserDataAccounts);

  constructor(private api: ApiService, protected auth: AuthService, private guard: AuthGuard) { }

  ngOnDestroy(): void {
    this.userAccountsEmitter.unsubscribe();
  }

  updateUserAccountsTable = () => {
    if(this.userAccountsEmitter.observed && !this.userAccountsEmitter.closed && this.auth.currentUser?.customer?.id && this.guard.canActivate()){
        this.api.getAllAccountsByCustomerId(this.auth.currentUser?.customer?.id).subscribe({
        next: (value) => { this.newUserDataAccounts = value; },
        complete: () => {
          this.userAccountsEmitter.next(this.newUserDataAccounts);
          asyncScheduler.schedule(this.updateUserAccountsTable, 1000); }
        });
    } else {
      asyncScheduler.schedule(this.updateUserAccountsTable, 100);
    }
  }
}
