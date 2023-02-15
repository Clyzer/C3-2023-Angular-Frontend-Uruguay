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

  protected lastMovementsFinal: LastMovementsModel[] = [];

  constructor(protected lastMovementsCustomerService: LastMovementsCustomerService){}

  ngOnInit(): void {
    this.lastMovementsCustomerService.lastMovementsFinalEmitter.subscribe({
      next: (data: LastMovementsModel[]) => {
        if (JSON.stringify(this.lastMovementsFinal) !== JSON.stringify(data.slice(0,8))) {
          this.lastMovementsFinal = data.slice(0,8);;
        }
      }
    })
  }

}
