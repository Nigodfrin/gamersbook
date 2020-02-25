import { Component, Input } from '@angular/core';
import { Notif } from 'src/app/models/Notif';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'notifs-component',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotifsComponent {

    @Input() notifs: Notif[];

    constructor(private userServ: UserService){

    }

    acceptFriend(notif: Notif, value: boolean){
      console.log(value);
      if(value){
        console.log('test');
        this.userServ.acceptFriend(notif.senderPseudo).subscribe(res => {
          console
          .log(res);
        });
      }
      else {
        this.userServ.refuseFriend(notif.senderPseudo).subscribe(res => {
          console
          .log(res);
        });;
      }
    }



}
