import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Post } from "../models/Post";
import { of, Observable } from "rxjs";
@Injectable({ providedIn: 'root' })
export class PostService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
  getAll() {
    return this.http.get<Post[]>(`${this.baseUrl}api/postsQuestion`)
      .pipe(map(res => res.map(m => new Post(m))));
  }

  filter(selectedVal: string,filter: string) {
    return this.http.get<Post[]>(`${this.baseUrl}api/postsQuestion/filter/${selectedVal}/${filter}`)
      .pipe(map(res => res.map(m => new Post(m))));

  }
  deletePost(question: Post) {
    return this.http.delete<boolean>(`${this.baseUrl}api/postsQuestion/${question.id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  update(title: string, body: string, id: number): Observable<boolean> {
    return this.http.put<Post>(`${this.baseUrl}api/postsQuestion`, { title: title, body: body, id: id }).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  addQuestion(title: string, body: string): Observable<boolean> {
    return this.http.post<Post>(`${this.baseUrl}api/postsQuestion`, new Post({ title: title, body: body })).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  getById(id: any) {
    return this.http.get<Post>(`${this.baseUrl}api/postsQuestion/${id}`).pipe(
      map(m => !m ? null : new Post(m)),
      catchError(err => of(null))
    );
  }
  // getNewest() {
  //   return this.http.get<Post[]>(`${this.baseUrl}api/postsQuestion/newest`)
  //     .pipe(map(res => res.map(m => new Post(m))));
  // }
  // getNonAnswered() {
  //   return this.http.get<Post[]>(`${this.baseUrl}api/postsQuestion/nonAnswered`)
  //     .pipe(map(res => res.map(m => new Post(m))));
  // }
  // getWithTags() {
  //   return this.http.get<Post[]>(`${this.baseUrl}api/postsQuestion/withTags`)
  //     .pipe(map(res => res.map(m => new Post(m))));
  // }
  // getOrderByVotes() {
  //   return this.http.get<Post[]>(`${this.baseUrl}api/postsQuestion/votes`)
  //     .pipe(map(res => res.map((m) => new Post(m))));
  // }
  addPost(post: Post) {
    return this.http.post<Post>(`${this.baseUrl}api/postRep`, post).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  delete(response: Post) {
    return this.http.delete<boolean>(`${this.baseUrl}api/postRep/${response.id}`).pipe(
      map(res => true),
      catchError(err => {
        console.error(err);
        return of(false);
      })
    );
  }
  getAllRep(id: number, acceptedId: number) {
    return this.http.get<Post[]>(`${this.baseUrl}api/postRep/${id}/${acceptedId}`)
      .pipe(map(res => res.map(m => new Post(m))));
  }
  getRepById(id: number) {
    return this.http.get<Post>(`${this.baseUrl}api/postRep/${id}`).pipe(
      map(m => !m ? null : new Post(m)),
      catchError(err => of(null))
    );
  }
  putAcceptedPost(question: Post, acceptedPostId: number): Observable<boolean> {
    return this.http.get<Post>(`${this.baseUrl}api/postRep/putAccepted/${question.id}/${acceptedPostId}`)
      .pipe(map(res => true),
        catchError(err => {
          console.error(err);
          return of(false);
        })
      );
  }
}