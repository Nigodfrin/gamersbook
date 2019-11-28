import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { Post } from "../models/Post";
@Injectable({ providedIn: 'root' })
export class PostService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
    getAll() {
        return this.http.get<Post[]>(`${this.baseUrl}api/posts`)
          .pipe(map(res => res.map(m => new Post(m))));
      }
}