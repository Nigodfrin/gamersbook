import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { EventData } from "../models/EventData";
import { of } from "rxjs";
import { EventGame } from "../models/EventGame";
import { Notif } from "../models/Notif";
import { Event } from "../models/Event";
import { truncate } from "fs";
@Injectable({ providedIn: 'root' })
export class EventGameService {
  constructor(private http: HttpClient,@Inject('BASE_URL') private baseUrl: string) {
  }
  public getEvents() {
    return this.http.get<Event[]>(`${this.baseUrl}api/events`)
    .pipe(map(res => res.map(m => new Event(m))));
  }
  createEvent(eventData: Event) {
    return this.http.post<Event>(`${this.baseUrl}api/events`, eventData)
    .pipe(map(res => new Event(res)),
    );
  }
  askForParticipation(event: Event){
    return  this.http.post<boolean>(`${this.baseUrl}api/events`,event)
    .pipe(map(res => res),
    catchError(err => {
      console.error(err);
      return of(false);
    })    
    );
  }
  getEventById(id: string) {
    return this.http.get<Event>(`${this.baseUrl}api/events/${id}`)
    .pipe(map(res => new Event(res)),
    );
  }
  acceptEvent(notif: Notif,accepted: boolean) {
    console.log(notif)
    return this.http.post<boolean>(`${this.baseUrl}api/events/respondToEventRequest/${accepted}`,notif)
    .pipe(map(res => true),
    catchError(err => {
      console.error(err);
      return of(false);
    })    
    );
  }
  refuseEvent(notif: Notif) {
    return this.http.delete<boolean>(`${this.baseUrl}api/events/refuseInvit/${notif.id}`)
    .pipe(map(res => true),
    catchError(err => {
      console.error(err);
      return of(false);
    })    
    );
  }


}