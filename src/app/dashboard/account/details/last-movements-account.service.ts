import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, asyncScheduler } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { AuthGuard } from 'src/app/login/guards/auth.guard';
import { LastMovementsModel } from 'src/app/interfaces/last-movements.interface';
import { AccountModel } from 'src/app/interfaces/account.interface';
import { DepositListModel } from 'src/app/interfaces/deposit.list.interface';
import { TransferListModel } from 'src/app/interfaces/transfer.list.interface';
import { AuthService } from 'src/app/login/services/auth.service';
import { UserDataService } from '../../services/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class LastMovementsAccountService implements OnDestroy {

  protected lastMovements: LastMovementsModel[] = [];
  protected lastMovementsFinal: LastMovementsModel[] = [];
  public lastMovementsFinalEmitter: BehaviorSubject<LastMovementsModel[]> = new BehaviorSubject<LastMovementsModel[]>(this.lastMovementsFinal);
  private update: boolean = false;

  protected customerAccountsTransfer: AccountModel[] = [];
  protected customerAccountsDeposits: AccountModel[] = [];

  protected lastMovementsTransfers: TransferListModel[] = [];
  public lastMovementsTransfersEmitter: BehaviorSubject<TransferListModel[]> = new BehaviorSubject<TransferListModel[]>(this.lastMovementsTransfers);

  protected lastMovementsDeposits: DepositListModel[] = [];
  public lastMovementsDepositsEmitter: BehaviorSubject<DepositListModel[]> = new BehaviorSubject<DepositListModel[]>(this.lastMovementsDeposits);

  constructor(private api: ApiService, protected auth: AuthService, protected userData: UserDataService, private guard: AuthGuard) {
    this.updateLastTransferAccountTable();
    this.updateLastDepositsAccountTable();
    this.updateMovements();
  }

  ngOnDestroy(): void {
    this.lastMovementsTransfersEmitter.unsubscribe();
    this.lastMovementsDepositsEmitter.unsubscribe();
  }

  private updateLastTransferAccountTable = () => {
    if(!this.lastMovementsTransfersEmitter.closed && this.auth.currentUser?.customer?.id && this.userData.check('currentAccount') && this.guard.canActivate()){
      this.api.getAccountById(this.userData.get('currentAccount')).subscribe({
        next: (value) => {
          if (JSON.stringify(this.customerAccountsTransfer) !== JSON.stringify([value])) {
            this.customerAccountsTransfer = [value];
          }
        },
        complete: () => {
          this.updateLastTransferDo();
        }
      })
    } else asyncScheduler.schedule(this.updateLastTransferAccountTable, 100);
  }

  private updateLastTransferDo(): void {
    let current: TransferListModel[] = [];
    this.customerAccountsTransfer.forEach((value, index) => {
      this.api.getTransfersHistory(value.id).subscribe({
        next: (data) => {
          current.push({ account: value, transfers: data });
        },
        complete: () => {
          if(index + 1 === this.customerAccountsTransfer.length){
            if(JSON.stringify(this.lastMovementsTransfers) !== JSON.stringify(current)){
              this.lastMovementsTransfers = current;
              this.lastMovementsTransfersEmitter.next(this.lastMovementsTransfers);
              this.update = true;
            }
            asyncScheduler.schedule(this.updateLastTransferAccountTable, 1000);
          }
        }
      })
    })
  }

  private updateLastDepositsAccountTable = () => {
    if(!this.lastMovementsDepositsEmitter.closed && this.auth.currentUser?.customer?.id && this.userData.check('currentAccount') && this.guard.canActivate()){
      this.api.getAccountById(this.userData.get('currentAccount')).subscribe({
        next: (value) => {
          if (JSON.stringify(this.customerAccountsDeposits) !== JSON.stringify([value])) {
            this.customerAccountsDeposits = [value];
          }
        },
        complete: () => {
          this.updateLastDepositsDo();
        }
      })
    } else asyncScheduler.schedule(this.updateLastDepositsAccountTable, 100);
  }

  private updateLastDepositsDo(): void {
    let current: DepositListModel[] = [];
    this.customerAccountsDeposits.forEach((value, index) => {
      this.api.getDepositsHistory(value.id).subscribe({
        next: (data) => {
          current.push({ account: value, deposits: data });
        },
        complete: () => {
          if(index + 1 === this.customerAccountsDeposits.length){
            if(JSON.stringify(this.lastMovementsDeposits) !== JSON.stringify(current)){
              this.lastMovementsDeposits = current;
              this.lastMovementsDepositsEmitter.next(this.lastMovementsDeposits);
              this.update = true;
            }
            asyncScheduler.schedule(this.updateLastDepositsAccountTable, 1000);
          }
        }
      })
    })
  }

  private updateMovements = () => {
    if(this.guard.canActivate() && this.update){
      this.orderMovementsLists();
      asyncScheduler.schedule(this.updateMovements, 1000);
    } else {
      asyncScheduler.schedule(this.updateMovements, 100);
    }
  }

  orderMovementsLists(): void {
    if (this.update && this.auth.currentUser?.customer.id && this.userData.check('currentAccount')){
      this.update = false;
      this.lastMovements = [];
      this.lastMovementsTransfers.forEach( (value)  => {
        value.transfers.forEach( ( data ) => {
          this.lastMovements.push({ id: data.id, outcome: data.outcome, balance: data.balance, dateTime: data.dateTime, type: "Transferencia" });
        });
      });
      this.lastMovementsDeposits.forEach( (value)  => {
        value.deposits.forEach( ( data ) => {
          this.lastMovements.push({ id: data.id, outcome: data.account, balance: data.amount, dateTime: data.dateTime, type: "Deposito" });
        });
      });
      this.lastMovements.sort((a: LastMovementsModel, b: LastMovementsModel) => {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      });
      this.lastMovements.reverse();
      this.lastMovementsFinalEmitter.next(this.lastMovements);
    }
  }
}
