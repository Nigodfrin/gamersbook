import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/models/Game';
import { UserService } from 'src/app/services/user.service';
import { SignalRService } from 'src/app/services/signalR.service';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventGameService } from 'src/app/services/event.service';
import { EventData } from 'src/app/models/EventData';
import { EventGame } from 'src/app/models/EventGame';
import * as _ from 'lodash';
import { AccessType, Event } from 'src/app/models/Event';
import { Notif, NotificationTypes } from 'src/app/models/Notif';
import { NotifsService } from 'src/app/services/notifs.service';

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

eventsData: Event[] = [];
games: Game[]= [];
types = AccessType;

    constructor(private eventGame: EventGameService,
      private userService: UserService,
      private hub: SignalRService,
      private gameServ: GameService,
      private notifService: NotifsService,
      private authServ: AuthenticationService){
      this.eventGame.getEvents().subscribe(res => {
        this.eventsData = res;
        console.log(this.eventsData);
      });
    }
    ngOnInit(){
        this.gameServ.getAllGames().subscribe(res => {
            this.games = res;
        });
    }
    applyFilter(games: Game[]){
      games.map(x => this.eventsData.some(g => x.id === g.gameId) ? this._filterEvent(x): null);
    }

    _filterEvent(x: Game){
      this.eventsData = this.eventsData.filter(e => e.gameId=== x.id);
      console.log(this.eventsData,x);
    }
    async askParticipation(event: Event){
      this.userService.getById(event.createdByUserId).subscribe(res => {
        const notif = new Notif({
            notificationType: NotificationTypes.RequestEventParticipation,
            senderId : this.authServ.currentUser.id,
            see : false,
            receiverId : res.id,
            createdOn : new Date(Date.now()),
            eventId : event.id
        })
        this.notifService.sendNotification(notif,null).subscribe(res2 =>{
          this.hub.askForParticipation(res.pseudo,notif);
        })
      });
    }
    
    
}

