import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Post } from "../models/Post";
import { of, Observable } from "rxjs";
@Injectable({ providedIn: 'root' })
export class PostService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  getAll() {
    return this.http.get<Post[]>(`${this.baseUrl}api/posts`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  // getLast(){
  //   return this.http.get<Post>(`${this.baseUrl}api/posts/last`)
  //   .pipe();
  // }
  addPost(post: Post) {
    return this.http.post<Post>(`${this.baseUrl}api/posts`, post).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  addQuestion(title: string, body: string): Observable<boolean> {
    return this.http.post<Post>(`${this.baseUrl}api/posts/add`, { title: title, body: body }).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  getAllRep(id: number, acceptedId: number) {
    return this.http.get<Post[]>(`${this.baseUrl}api/posts/allRep/${id}/${acceptedId}`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  getById(id: any) {
    return this.http.get<Post>(`${this.baseUrl}api/posts/${id}`).pipe(
      map(m => !m ? null : new Post(m)),
      catchError(err => of(null))
    );
  }
  getRepById(id: number) {
    return this.http.get<Post>(`${this.baseUrl}api/posts/rep/${id}`).pipe(
      map(m => !m ? null : new Post(m)),
      catchError(err => of(null))
    );
  }
  getNewest() {
    return this.http.get<Post[]>(`${this.baseUrl}api/posts/newest`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  getNonAnswered() {
    return this.http.get<Post[]>(`${this.baseUrl}api/posts/nonAnswered`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  getWithTags() {
    return this.http.get<Post[]>(`${this.baseUrl}api/posts/withTags`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  getOrderByVotes() {
    return this.http.get<Post[]>(`${this.baseUrl}api/posts/votes`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
    putAcceptedPost(question:Post,acceptedPostId: number): Observable<boolean> {
      return this.http.get<Post>(`${this.baseUrl}api/posts/putAccepted/${question.id}/${acceptedPostId}`)
      .pipe(map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
      );
    }
}