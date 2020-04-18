import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { EventData } from "../models/EventData";
import { of } from "rxjs";
import { EventGame } from "../models/EventGame";
import { Notif } from "../models/Notif";
@Injectable({ providedIn: 'root' })
export class EventGameService {
  constructor(private http: HttpClient,@Inject('BASE_URL') private baseUrl: string) {
  }
  public getEvents() {
    return this.http.get<EventData[]>(`${this.baseUrl}api/events`)
    .pipe(map(res => res.map(m => new EventData(m))));
  }
  createEvent(eventData: EventData) {
    return this.http.post<EventData>(`${this.baseUrl}api/events`, eventData)
    .pipe(map(res => new EventGame(res)),
    );
  }
  getEventById(uuid: string) {
    return this.http.get<EventGame>(`${this.baseUrl}api/events/${uuid}`)
    .pipe(map(res => new EventGame(res)),
    );
  }
  acceptEvent(notif: Notif) {
    return this.http.post<boolean>(`${this.baseUrl}api/events/acceptInvit`,notif)
    .pipe(map(res => true),
    catchError(err => {
      console.error(err);
      return of(false);
    })    
    );
  }
  refuseEvent(notif: Notif) {
    return this.http.delete<boolean>(`${this.baseUrl}api/events/refuseInvit/${notif.uuid}`)
    .pipe(map(res => true),
    catchError(err => {
      console.error(err);
      return of(false);
    })    
    );
  }


}