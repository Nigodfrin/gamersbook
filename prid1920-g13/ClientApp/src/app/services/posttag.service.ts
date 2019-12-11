import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostTag } from '../models/PostTag';
import { map , catchError} from 'rxjs/operators';
import { of ,Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostTagService {
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  addPostTag(tagid: number[]) : Observable<boolean> {
    console.log(tagid);
    return this.http.post<number[]>(`${this.baseUrl}api/posttags/add`, tagid).pipe(
        map(res => true),
        catchError(err => {
          console.error(err);
          return of(false);
        })
    );
  }
}