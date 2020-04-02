import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Discussion } from "../models/Discussion";
import { User } from "../models/User";
import { of } from "rxjs";
import { Message } from "../models/Message";
@Injectable({ providedIn: 'root' })
export class MessageService {


    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string){ }



    public addMessage(m: Message) {
        return this.http.post(`${this.baseUrl}api/message`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
              })
          );
    }
}