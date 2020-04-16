import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { EventData } from "../models/EventData";
import { of } from "rxjs";
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
      .pipe(map(res => true),
        catchError(err => {
          console.error(err);
          return of(false);
        })
      );
  }

}