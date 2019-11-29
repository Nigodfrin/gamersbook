import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Post } from "../models/Post";
import { of } from "rxjs";
@Injectable({ providedIn: 'root' })
export class PostService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
    getAll() {
        return this.http.get<Post[]>(`${this.baseUrl}api/posts`)
          .pipe(map(res => res.map(m => new Post(m))));
      }
      getById(id: any) {
        return this.http.get<Post>(`${this.baseUrl}api/posts/${id}`).pipe(
          map(m => !m ? null : new Post(m)),
          catchError(err => of(null))
        );
      }
}