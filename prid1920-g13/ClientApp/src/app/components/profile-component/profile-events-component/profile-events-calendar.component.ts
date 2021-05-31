import { Component } from "@angular/core";
import timegrid from '@fullcalendar/timegrid';
import dayGrid from '@fullcalendar/daygrid';
import { UserService } from "src/app/services/user.service";
import { DatePipe } from '@angular/common'
import { AccessType } from "src/app/models/Event";

@Component({
    selector: 'profile-events-calendar-component',
    templateUrl: './profile-events-calendar.component.html',
    styleUrls: ['./profile-events-calendar.component.css'],
})
export class ProfileEventsCalendarComponent {
    calendarPlugins = [dayGrid,timegrid]; 
    header = { left: 'today prev,next', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }
    events = []
    constructor(private userService: UserService, public datepipe: DatePipe) {
        this.userService.getEvents().subscribe(res => {
            res.forEach(event => {
                const start = new Date(event.start_date);
                const end = new Date(event.end_date);
                const color = this.getColorByAccessType(event.accessType);
                const eventForCalendar = {
                    id: event.id,
                    start: start,
                    end: end,
                    title: event.name,
                    backgroundColor: color,
                    borderColor: color
                }
                this.events = [...this.events, eventForCalendar];
            });
        })
    }
    getColorByAccessType(accessType: AccessType):string{
        switch(accessType){
            case AccessType.Public: return 'green'
            case AccessType.Friends: return 'orangered'
            case AccessType.Private: return 'goldenrod'
            default: return 'blue'
        }
    }


}
