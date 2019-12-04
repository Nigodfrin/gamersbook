import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Tag } from "../models/Tag";

@Injectable({ providedIn: 'root' })
export class TagService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }
    getAllTags(){
        return this.http.get<Tag[]>(`${this.baseUrl}api/tags`)
      .pipe(map(res => res.map(m => new Tag(m))));
    }
}