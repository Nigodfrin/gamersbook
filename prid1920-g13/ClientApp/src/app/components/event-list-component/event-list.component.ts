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

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

eventsData: EventData[] = [];
games: Game[]= [];

    constructor(private eventGame: EventGameService,private gameServ: GameService,private authServ: AuthenticationService){
      this.eventGame.getEvents().subscribe(res => {
        this.eventsData = res;
      });
    }
    ngOnInit(){
        this.gameServ.getAllGames().subscribe(res => {
            this.games = res;
        });
    }
    applyFilter(games: Game[]){
      games.map(x => this.eventsData.some(g => x.id === g.game.id) ? this._filterEvent(x): null);
    }

    _filterEvent(x: Game){
      this.eventsData = this.eventsData.filter(e => e.game.id=== x.id);
      console.log(this.eventsData,x);
    }
    
    
}

