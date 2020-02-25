import { Component } from '@angular/core';
import { User, Role } from '../../models/User';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Notif } from 'src/app/models/Notif';
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  userSearch= "";
  isExpanded = false;
  notifications: Notif[] = [];
  numNotif: number = 0;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userServ: UserService
  ) 
  {
    this.numNotif = this.notifications.length
    this.getNotifs();
   }
   showNotifs(){
     document.getElementById('notifCompo').style.display = 'block'
   }
  collapse() {
    this.isExpanded = false;
  }
  searchUser(){
    console.log(this.userSearch);
    this.router.navigate(['/users'], { queryParams: { name: this.userSearch } });    
    this.userSearch = "";
  }
  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  get currentUser() {
    return this.authenticationService.currentUser;
  }
  get isAdmin() {
    return this.currentUser && this.currentUser.role === Role.Admin;
  }
  getNotifs(){
    this.userServ.getNotifs().subscribe(res => {
      this.notifications = res;
      this.numNotif = res.length;
      console.log(res);
    });
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}