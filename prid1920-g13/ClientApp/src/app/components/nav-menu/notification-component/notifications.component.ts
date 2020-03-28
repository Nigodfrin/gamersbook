import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Notif } from 'src/app/models/Notif';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'notifs-component',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotifsComponent {

    @Input() notifs: Notif[];
    @Output() getNotifs: EventEmitter<any> = new EventEmitter();

    constructor(private userServ: UserService){

    }

    



}
