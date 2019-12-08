import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vote } from '../models/Vote';
import { map , catchError} from 'rxjs/operators';
import { of ,Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class VoteService {
  getVotes(postid: number) {
    return this.http.get<Vote[]>(`${this.baseUrl}api/votes/${postid}`)
      .pipe(map(res => res.map(m => new Vote(m))));
  }
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
public add(v: Vote): Observable<boolean> {
    return this.http.post<Vote>(`${this.baseUrl}api/votes`, v).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  delete(v: Vote){
    return this.http.delete<Vote>(`${this.baseUrl}api/votes/${v.authorId}/${v.postId}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
      );
  }
}