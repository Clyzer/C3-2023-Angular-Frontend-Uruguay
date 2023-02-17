import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositComponent } from './deposit/deposit.component';
import { AuthGuard } from 'src/app/login/guards/auth.guard';
import { TransferComponent } from './transfer/transfer.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [{
  path: 'accounts',
  children: [
    { path: 'deposits', title: 'Deposits', component: DepositComponent, canActivate: [ AuthGuard ] },
    { path: 'transfer', title: 'Transfers', component: TransferComponent, canActivate: [ AuthGuard ] },
    { path: 'account', title: 'Account', component: DetailsComponent, canActivate: [ AuthGuard ] },
    { path: '**', redirectTo: '/dashboard/view' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
