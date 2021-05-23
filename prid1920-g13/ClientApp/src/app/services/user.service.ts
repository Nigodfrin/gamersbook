import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { map, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Post } from '../models/Post';
import { Game } from '../models/Game';
import { Notif } from '../models/Notif';
@Injectable({ providedIn: 'root' })
export class UserService {
  
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    refuseFriend(id: number) {
      return this.http.delete<boolean>(`${this.baseUrl}api/users/refuseFriend/${id}`)
      .pipe(map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
    }
    acceptFriend(id: number) {
      return this.http.post<boolean>(`${this.baseUrl}api/users/acceptFriend`,id)
      .pipe(map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
    }
  getAll() {
    return this.http.get<User[]>(`${this.baseUrl}api/users/all`)
      .pipe(map(res => res.map(m => new User(m))));
  }
  getUserGames(pseudo: string) {
    return this.http.get<Game[]>(`${this.baseUrl}api/users/getUserGames/${pseudo}`)
      .pipe(map(res => res.map(m => new Game(m))));
  }

  getById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}api/users/${userId}`).pipe(
      map(m => !m ? null : new User(m)),
      catchError(err => of(null))
    );
  }

  getNotifs() {
    return this.http.get<Notif[]>(`${this.baseUrl}api/users/notifications`)
    .pipe(map(res => res.map(m => new Notif(m))));
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
  public getUsers(name: string){
    return this.http.get<User[]>(`${this.baseUrl}api/users/search/${name}`)
      .pipe(map(res => res.map(m => new User(m))));
  }
  public addFriend(user: User){
    return this.http.post<User>(`${this.baseUrl}api/users/addFriend`, user).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  public deleteFriend(id: number){
    console.log("delete",id);
    return this.http.delete(`${this.baseUrl}api/users/deleteFriend/${id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  public getFriend(){
    return this.http.get<User[]>(`${this.baseUrl}api/users/getFriends`)
      .pipe(map(res => res.map(m => new User(m))));
  }
  public getUserPostRep(userId:any){
    console.log(userId);
    return this.http.get<Post[]>(`${this.baseUrl}api/users/userPostsRep/${userId}`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  public getUserPostQuest(userId:any){
    return this.http.get<Post[]>(`${this.baseUrl}api/users/userPostsQuest/${userId}`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  public getUserComment(userId: any){
    return this.http.get<Comment[]>(`${this.baseUrl}api/users/userComment/${userId}`)
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