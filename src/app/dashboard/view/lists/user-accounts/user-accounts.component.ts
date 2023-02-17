import { Component, OnInit } from '@angular/core';
import { AccountModel } from 'src/app/interfaces/account.interface';
import { UserAccountsService } from './user-accounts.service';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/dashboard/services/user-data.service';

@Component({
  selector: 'app-user-accounts',
  providers: [ UserAccountsService ],
  templateUrl: './user-accounts.component.html',
  styleUrls: ['./user-accounts.component.scss']
})

export class UserAccountsComponent implements OnInit {

  UserAccountsList: AccountModel[] = [];

  colors: string[] = [ "red", "blue", "emerald", "yellow", "lime", "green", "violet", "purple", "rose" ];

  constructor(private userData: UserDataService, private userAccountsService: UserAccountsService, private router: Router){}

  ngOnInit(): void {
    this.userAccountsService.userAccountsEmitter.subscribe((data: AccountModel[]) => { if (JSON.stringify(this.UserAccountsList) !== JSON.stringify(data)) this.UserAccountsList = data });
    this.userAccountsService.updateUserAccountsTable();
  }

  toAccountEdit(i: number): void {
    this.userData.set('currentColor', this.colors[i]);
    this.userData.set('currentAccount', this.UserAccountsList[i].id);
    this.router.navigate(['/accounts/account']);
  }

}
