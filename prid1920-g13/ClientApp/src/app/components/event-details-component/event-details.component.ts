import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/models/Event';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EventGameService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
    event: Event
    createByUser: User

    constructor(private route: ActivatedRoute,
        private eventService: EventGameService,
        private userService: UserService,
        private authService: AuthenticationService
        ) {
    }
    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.eventService.getEventById(id).subscribe(res => {
            this.event = res;
            this.userService.getById(this.event.createdByUserId).subscribe(res => {
                this.createByUser = res;
            })
        })
      }
      deleteUser(user: User){
          console.log(user);
      }
      isCreator(){
          return this.authService.currentUser.id === this.event.createdByUserId;
      }
}