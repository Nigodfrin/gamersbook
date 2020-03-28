import { Component, ViewEncapsulation } from '@angular/core';
import { User, Role } from '../../models/User';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Notif } from 'src/app/models/Notif';
import {ToastService} from '../../Helpers/toast/toast.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  encapsulation: ViewEncapsulation.None,
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
    private userServ: UserService,
    public toastService: ToastService
  ) 
  {
    this.getNotifs();
    this.numNotif = this.notifications.length
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
    });
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  acceptFriend(notif: Notif, value: boolean,index: number){
    if(value){
      this.userServ.acceptFriend(notif.senderPseudo).subscribe(res => {
        this.toastService.show(`${notif.senderPseudo} has been accepted`, { classname: 'bg-success text-light', delay: 5000 });
      });
    }
    else {
      this.userServ.refuseFriend(notif.senderPseudo).subscribe(res => {
        console.log("test");
        this.toastService.show(`${notif.senderPseudo} has been refused`, { classname: 'bg-danger text-light', delay: 5000 });
      });;
    }
  }
}