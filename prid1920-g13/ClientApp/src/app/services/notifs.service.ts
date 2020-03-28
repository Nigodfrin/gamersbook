import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Post } from "../models/Post";
import { of, Observable } from "rxjs";
import { Tag } from "../models/Tag";
@Injectable({ providedIn: 'root' })
export class NotifsService {


  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  removeNotification(notif: number) {
    return this.http.delete<boolean>(`${this.baseUrl}api/notifsNeo4J/`).pipe(
        map(res => true),
        catchError(err => {
          console.error(err);
          return of(false);
        })
      );
  }

}