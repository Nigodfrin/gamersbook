import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tag } from '../models/Tag';
import { map , catchError} from 'rxjs/operators';
import { of ,Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class TagService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  getAll() {
    return this.http.get<Tag[]>(`${this.baseUrl}api/tags`)
      .pipe(map(res => res.map(m => new Tag(m))));
  }
  public isNameAvailable(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}api/tags/available/${name}`);
  }
  public update(t: Tag): Observable<boolean> {
    
    return this.http.put<Tag>(`${this.baseUrl}api/tags/${t.id}`, t).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  public delete(t: Tag): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}api/tags/${t.id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  public add(t: Tag): Observable<boolean> {
    return this.http.post<Tag>(`${this.baseUrl}api/tags`, t).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
}