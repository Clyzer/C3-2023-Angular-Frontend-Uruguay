import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  constructor(protected userData: UserDataService) {}

  ngOnInit(): void {
    this.userData.delete('currentAccount');
    this.userData.delete('currentColor');
  }

}
