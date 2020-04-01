import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Comment } from "../models/Comment";
import { of, Observable } from "rxjs";
import { Discussion } from "../models/Discussion";
import { User } from "../models/User";
@Injectable({ providedIn: 'root' })
export class DiscussionService {


    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string){ }



    public getDiscussions(m: User){
        return this.http.get<Discussion[]>(`${this.baseUrl}api/discussion/${m.id}`)
        .pipe(map(res => res.map(m => new Discussion(m))));
    }
    public addDiscussion(d: Discussion) {
        return this.http.post<number>(`${this.baseUrl}api/discussion`, d).pipe(
            map(res => res)
          );
    }
}