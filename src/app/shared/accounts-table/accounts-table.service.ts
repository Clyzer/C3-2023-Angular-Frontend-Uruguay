import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, asyncScheduler } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AccountModel } from 'src/app/interfaces/account.interface';
import { AuthGuard } from '../../login/guards/auth.guard';

@Injectable({
  providedIn: 'root'
})
export class AccountsTableService implements OnDestroy {

  protected newDataAccounts: AccountModel[] = [];
  public accountsEmitter: BehaviorSubject<AccountModel[]> = new BehaviorSubject<AccountModel[]>(this.newDataAccounts);

  constructor(private api: ApiService, private guard: AuthGuard) { }

  ngOnDestroy(): void {
    this.accountsEmitter.unsubscribe();
  }

  updateAllAccounts = () => {
    if(this.accountsEmitter.observed && !this.accountsEmitter.closed && this.guard.canActivate()){
      this.api.getAllAccounts().subscribe({
        next: (value) => { this.newDataAccounts = value; },
        complete: () => {
          this.accountsEmitter.next(this.newDataAccounts);
          asyncScheduler.schedule(this.updateAllAccounts, 1000); }
      });
    } else {
      asyncScheduler.schedule(this.updateAllAccounts, 100);
    }
  }
}
