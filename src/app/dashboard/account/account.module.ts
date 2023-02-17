import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepositComponent } from './deposit/deposit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountRoutingModule } from './account-routing.module';
import { TransferComponent } from './transfer/transfer.component';
import { ReasonTypes } from 'src/app/interfaces/reason-type.interface';
import { EditComponent } from './edit/edit.component';



@NgModule({
  declarations: [
    DepositComponent,
    TransferComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccountRoutingModule
  ],
  providers: [
    ReasonTypes
  ]
})
export class AccountModule { }
