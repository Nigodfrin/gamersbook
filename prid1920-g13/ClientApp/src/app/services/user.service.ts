import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Post } from '../models/Post';
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
    return this.http.delete<boolean>(`${this.baseUrl}api/users/${m.pseudo}`).pipe(
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
  public getUserPostRep(){
    return this.http.get<Post[]>(`${this.baseUrl}api/users/userPostsRep`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  public getUserPostQuest(){
    return this.http.get<Post[]>(`${this.baseUrl}api/users/userPostsQuest`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  public getUserComment(){
    return this.http.get<Comment[]>(`${this.baseUrl}api/users/userComment`)
      .pipe(map(res => res.map(m => new Comment(m))));
  }
  public uploadPicture(pseudo, file): Observable<string> {
    console.log(file);
    const formData = new FormData();
    formData.append('pseudo', pseudo);
    formData.append('picture', file);
    return this.http.post<string>(`${this.baseUrl}api/users/upload`, formData).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }

  public confirmPicture(pseudo, path): Observable<string> {
    console.log(pseudo, path);
    return this.http.post<string>(`${this.baseUrl}api/users/confirm`, { pseudo: pseudo, picturePath: path }).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }

  public cancelPicture(path): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}api/users/cancel`, { picturePath: path }).pipe(
      catchError(err => {
        console.error(err);
        return of(null);
      })
    );
  }
}