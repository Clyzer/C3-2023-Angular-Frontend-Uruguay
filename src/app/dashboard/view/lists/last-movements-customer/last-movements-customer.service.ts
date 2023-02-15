import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, asyncScheduler } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { AuthService } from '../../../../login/services/auth.service';
import { AuthGuard } from 'src/app/login/guards/auth.guard';
import { AccountModel } from '../../../../interfaces/account.interface';
import { TransferListModel } from '../../../../interfaces/transfer.list.interface';
import { DepositListModel } from '../../../../interfaces/deposit.list.interface';
import { LastMovementsModel } from 'src/app/interfaces/last-movements.interface';

@Injectable({
  providedIn: 'root'
})
export class LastMovementsCustomerService implements OnDestroy {

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

  constructor(private api: AppService, protected auth: AuthService, private guard: AuthGuard) {
    this.updateLastTransferCustomerTable();
    this.updateLastDepositsCustomerTable();
    this.updateMovements();
  }

  ngOnDestroy(): void {
    this.lastMovementsTransfersEmitter.unsubscribe();
    this.lastMovementsDepositsEmitter.unsubscribe();
  }

  private updateLastTransferCustomerTable = () => {
    if(!this.lastMovementsTransfersEmitter.closed && this.auth.currentUser?.customer?.id && this.guard.canActivate()){
      this.api.getAllAccountsByCustomerId(this.auth.currentUser.customer.id).subscribe({
        next: (value) => {
          if (JSON.stringify(this.customerAccountsTransfer) !== JSON.stringify(value)) {
            this.customerAccountsTransfer = value;
          }
        },
        complete: () => {
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
                  asyncScheduler.schedule(this.updateLastTransferCustomerTable, 1000);
                }
              }
            })
          })
        }
      })
    } else asyncScheduler.schedule(this.updateLastTransferCustomerTable, 100);
  }

  private updateLastDepositsCustomerTable = () => {
    if(!this.lastMovementsDepositsEmitter.closed && this.auth.currentUser?.customer?.id && this.guard.canActivate()){
      this.api.getAllAccountsByCustomerId(this.auth.currentUser.customer.id).subscribe({
        next: (value) => {
          if (JSON.stringify(this.customerAccountsDeposits) !== JSON.stringify(value)) {
            this.customerAccountsDeposits = value;
          }
        },
        complete: () => {
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
                  asyncScheduler.schedule(this.updateLastDepositsCustomerTable, 1000);
                }
              }
            })
          })
        }
      })
    } else asyncScheduler.schedule(this.updateLastDepositsCustomerTable, 100);
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
    if (this.update){
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
