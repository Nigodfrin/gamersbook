import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vote } from '../models/Vote';
import { map , catchError} from 'rxjs/operators';
import { of ,Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class VoteService {
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
}