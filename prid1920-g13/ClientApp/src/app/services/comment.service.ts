import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Comment } from "../models/Comment";
import { of, Observable } from "rxjs";
@Injectable({ providedIn: 'root' })
export class commentService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  public update(m: Comment): Observable<boolean> {
    
    return this.http.put<Comment>(`${this.baseUrl}api/comments/${m.id}`, m).pipe(
      map(res => true),
      catchError(err => {
        return of(false);
      })
    );
  }
  public delete(m: Comment): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}api/comments/${m.id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }

}