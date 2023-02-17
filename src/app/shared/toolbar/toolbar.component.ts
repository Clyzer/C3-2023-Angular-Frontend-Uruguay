import { Component } from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';
import { UserDataService } from 'src/app/dashboard/services/user-data.service';
import { AuthService } from 'src/app/login/services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {

  mobileMenu: boolean = false;
  userDropdown: boolean = false;
  currentRoute: string = '';

  constructor(private router: Router, private userData: UserDataService, protected auth: AuthService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd){
        this.currentRoute = event.url;
      }
    });
  }

  logout(){
    this.userData.clear();
    this.router.navigate(["/login/sign-up"]);
    this.userDropdown = !this.userDropdown;
  }

  userDropdownSwitch(){
    this.userDropdown = !this.userDropdown;
  }

  mobileMenuSwitch(){
    this.mobileMenu = !this.mobileMenu;
  }

  toDeposits() {
    this.userData.delete('currentAccount');
    this.userData.delete('currentColor');
  }

}
