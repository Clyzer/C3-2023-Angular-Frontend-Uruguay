import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepositComponent } from './deposit/deposit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';
import { TransferComponent } from './transfer/transfer.component';
import { ReasonTypes } from 'src/app/interfaces/reason-type.interface';
import { DetailsComponent } from './details/details.component';



@NgModule({
  declarations: [
    DepositComponent,
    TransferComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountRoutingModule
  ],
  providers: [
    ReasonTypes
  ],
  exports: [
    DepositComponent,
    TransferComponent,
    DetailsComponent
  ]
})
export class AccountModule { }
