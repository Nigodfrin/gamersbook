import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/models/Game';
import { UserService } from 'src/app/services/user.service';
import { SignalRService } from 'src/app/services/signalR.service';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventGameService } from 'src/app/services/event.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {


    constructor(private eventGame: EventGameService,private authServ: AuthenticationService){
      this.eventGame.getEvents().subscribe(res => {
        console.log("events",res);
      })
    }
}

