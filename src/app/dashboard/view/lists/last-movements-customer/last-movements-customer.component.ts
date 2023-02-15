import { Component, OnInit } from '@angular/core';
import { LastMovementsCustomerService } from './last-movements-customer.service';
import { LastMovementsModel } from 'src/app/interfaces/last-movements.interface';
import { BehaviorSubject, asyncScheduler } from 'rxjs';
import { AuthGuard } from 'src/app/login/guards/auth.guard';
import { TransferListModel } from 'src/app/interfaces/transfer.list.interface';
import { DepositListModel } from 'src/app/interfaces/deposit.list.interface';

@Component({
  selector: 'app-last-movements-customer',
  templateUrl: './last-movements-customer.component.html',
  styleUrls: ['./last-movements-customer.component.scss']
})
export class LastMovementsCustomerComponent implements OnInit {

  protected lastMovementsTransfers: TransferListModel[] = [];
  protected lastMovementsDeposits: DepositListModel[] = [];
  protected lastMovements: LastMovementsModel[] = [];
  protected lastMovementsFinal: LastMovementsModel[] = [];
  protected lastMovementsFinalEmitter: BehaviorSubject<LastMovementsModel[]> = new BehaviorSubject<LastMovementsModel[]>(this.lastMovementsFinal);

  private update: boolean = false;

  constructor(protected lastMovementsCustomerService: LastMovementsCustomerService, private guard: AuthGuard){}

  ngOnInit(): void {
    this.lastMovementsCustomerService.lastMovementsTransfersEmitter.subscribe({
      next: (data: TransferListModel[]) => {
        if (JSON.stringify(this.lastMovementsTransfers) !== JSON.stringify(data)) {
          this.lastMovementsTransfers = data;
          this.update = true;
        }}
    });
    this.lastMovementsCustomerService.lastMovementsDepositsEmitter.subscribe({
      next: (data: DepositListModel[]) => {
        if (JSON.stringify(this.lastMovementsDeposits) !== JSON.stringify(data)) {
          this.lastMovementsDeposits = data;
          this.update = true;
        }}
    });
    this.lastMovementsFinalEmitter.subscribe({
      next: (data: LastMovementsModel[]) => {
        if (JSON.stringify(this.lastMovementsFinal) !== JSON.stringify(data)) {
          this.lastMovementsFinal = data;
        }
      }
    })
    this.lastMovementsCustomerService.updateLastMovementsCustomerTable();
    this.updateMovements();
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
      this.lastMovements = this.lastMovements.slice(0,8);
      this.lastMovementsFinalEmitter.next(this.lastMovements);
    }
  }
}
