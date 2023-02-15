import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from '../material/material.module';
import { CustomersTableComponent } from './customers-table/customers-table.component';
import { AccountsTableComponent } from './accounts-table/accounts-table.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ToolbarComponent,
    CustomersTableComponent,
    AccountsTableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports:[
    ToolbarComponent,
    CustomersTableComponent,
    AccountsTableComponent
  ]
})
export class SharedModule { }
