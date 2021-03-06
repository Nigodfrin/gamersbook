import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';
import { User } from '../models/User';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  // l'utilisateur couramment connecté (undefined sinon)
  public currentUser: User;
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    // au départ on récupère un éventuel utilisateur stocké dans le sessionStorage
    const data = JSON.parse(sessionStorage.getItem('currentUser'));
    this.currentUser = data ? new User(data) : null;
  }
  login(pseudo: string, password: string) {
    return this.http.post<User>(`${this.baseUrl}api/users/authenticate`, { pseudo, password })
      .pipe(map(user => {
        user = new User(user);
        // login successful if there's a jwt token in the response
        if (user && user.token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          sessionStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser = user;
        }
        return user;
      }));
  }
  logout() {
    // remove user from local storage to log user out
    sessionStorage.removeItem('currentUser');
    this.currentUser = null;
  }
  public isPseudoAvailable(pseudo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}api/users/available/${pseudo}`);
  }
  public signup(pseudo: string, password: string,firstname: string,lastname:string,email:string,birthdate: string): Observable<User> {
    if(firstname == ""){firstname = null;}
    if(lastname == ""){lastname = null;}
    return this.http.post<User>(`${this.baseUrl}api/users/signup`, { pseudo: pseudo, password: password,firstname: firstname,lastname: lastname,email: email,birthdate:birthdate }).pipe(
      flatMap(res => this.login(pseudo, password)),
    );
  }
  public isEmailAvailable(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}api/users/verif/${email}`);
  }
  public isAdmin(): boolean{
    return this.currentUser && this.currentUser.role === 2;
  }
  isAuthor(id: any): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}api/users/isAuthor/${id}`);
  }
}