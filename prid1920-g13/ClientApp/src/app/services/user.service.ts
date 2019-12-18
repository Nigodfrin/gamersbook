import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  getAll() {
    return this.http.get<User[]>(`${this.baseUrl}api/users`)
      .pipe(map(res => res.map(m => new User(m))));
  }
  getById(id: number) {
    return this.http.get<User>(`${this.baseUrl}api/users/${id}`).pipe(
      map(m => !m ? null : new User(m)),
      catchError(err => of(null))
    );
  }
  public isPseudoAvailable(pseudo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}api/users/available/${pseudo}`);
  }
  public update(m: User): Observable<boolean> {
    
    return this.http.put<User>(`${this.baseUrl}api/users/${m.id}`, m)
    .pipe(map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  public changeReput(id: number, iduq: number): Observable<boolean> {
    
    return this.http.put<User>(`${this.baseUrl}api/users/reput/${id}/${iduq}` , {id, iduq})
    .pipe(map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  public changeReputVote(id: number, valeur: number): Observable<boolean> {
    
    return this.http.put<User>(`${this.baseUrl}api/users/reputation/${id}/${valeur}` , {id, valeur})
    .pipe(map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  public delete(m: User): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}api/users/${m.id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  public add(m: User): Observable<boolean> {
    return this.http.post<User>(`${this.baseUrl}api/users`, m).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
}