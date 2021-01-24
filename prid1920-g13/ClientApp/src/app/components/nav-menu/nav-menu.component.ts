import { Component, ViewEncapsulation } from '@angular/core';
import { User, Role } from '../../models/User';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Notif } from 'src/app/models/Notif';
import {ToastService} from '../../Helpers/toast/toast.service';
import * as _ from 'lodash';
import { SignalRService } from 'src/app/services/signalR.service';
import {Observable} from 'rxjs';
import {NgbTypeaheadConfig} from '@ng-bootstrap/ng-bootstrap';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { NotifsService } from 'src/app/services/notifs.service';
import { EventGameService } from 'src/app/services/event.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./nav-menu.component.css'],
  providers: [NgbTypeaheadConfig] 
})
export class NavMenuComponent {
  userSearch= "";
  isExpanded = false;
  notifications: Notif[] = [];
  numNotif: number = this.notifications.length;
  allUsers: User [] = [];
  constructor(
    private eventServ: EventGameService,
    private chatServ: SignalRService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userServ: UserService,
    public toastService: ToastService,
    config: NgbTypeaheadConfig,
    private notifServ: NotifsService
  ) 
  {
    config.showHint = true;
    if(this.authenticationService.currentUser){
      this.getNotifs();
    }
    this.numNotif = this.notifications.length
    this.userServ.getAll().subscribe(users => {
      this.allUsers = users;
    })
    this.chatServ.refreshNotifEvent.subscribe(res => {
      if(res){
        this.getNotifs();
      }
    })
   }
   search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.allUsers.filter(v => v.pseudo.toLowerCase().startsWith(term.toLocaleLowerCase()))
        .map(u => u.pseudo)
        .splice(0, 10))
    )
   showNotifs(){
     document.getElementById('notifCompo').style.display = 'block'
   }
  collapse() {
    this.isExpanded = false;
  }
  searchUser(){
    if(this.userSearch){
      this.router.navigate(['/users'], { queryParams: { name: this.userSearch } });    
      this.userSearch = "";
    }
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
      console.log(res);
      this.notifications = res;
      this.numNotif = res.length;
    });
  }
  acceptEvent(notif: Notif,value: boolean,index: number){
    if(value){
      console.log(notif);
      this.eventServ.acceptEvent(notif).subscribe(res => {
        if(res){
          this.toastService.show(`Your response has been send`, { classname: 'bg-success text-light', delay: 5000 });
          this.notifications.splice(index,1);
          // this.numNotif = this.notifications.length;
        }
        else {
          this.toastService.show(`An error occured please try again or contact the support`, { classname: 'bg-danger text-light', delay: 5000 });
        }
      });
    }
    else {
      this.eventServ.refuseEvent(notif).subscribe(res => {
        if(res){
          this.toastService.show(`Your response has been send`, { classname: 'bg-success text-light', delay: 5000 });
          this.notifications.splice(index,1);
        }
        else {
          this.toastService.show(`An error occured please try again or contact the support`, { classname: 'bg-danger text-light', delay: 5000 });
        }
      });
    }
  }
  getEvent(uuid :string){
    this.eventServ.getEventById(uuid).subscribe(res => {
      return res.name;
    });
  }
  logout() {
    this.chatServ.leaveRoom();
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
        this.toastService.show(`${notif.senderPseudo} has been refused`, { classname: 'bg-danger text-light', delay: 5000 });
      });;
    }
  }
}