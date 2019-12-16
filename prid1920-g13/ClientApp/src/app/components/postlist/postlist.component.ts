import { Component, ɵflushModuleScopingQueueAsMuchAsPossible,OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/Post';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/User';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';



/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'postlist-component',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.css']
})

export class PostListComponent implements OnInit {
  panelOpenState = false;
  posts: Post[];
  oneRepInQuestion: boolean;
  CurrentUser: User;
  test: string;
  selectedValue: string = "all";
  filter: string = "";

  constructor(private postService: PostService, private authService: AuthenticationService,public snackBar: MatSnackBar) { }
  ngOnInit() {
    this.postService.getAll().subscribe(posts => {
      this.posts = posts;
      this.CurrentUser = this.authService.currentUser;
    })

  }
  public onValChange(val: string) {
    this.selectedValue = val;
  }
  getAll(){
    this.postService.filter(this.selectedValue,this.filter).subscribe(posts => {
      this.posts = posts;
      this.CurrentUser = this.authService.currentUser;
    })
  }
  newest() {
      this.postService.filter(this.selectedValue,this.filter).subscribe(posts => {
        this.posts = posts;
      })
  }
  unanswered(){
    this.postService.filter(this.selectedValue,this.filter).subscribe(posts => {
      this.posts = posts;
    })
  }
  onChange(filter: string) {
    this.filter = filter;
    this.postService.filter(this.selectedValue,this.filter).subscribe(posts => {
      this.posts = posts;
    });

}
  votes() {
    var s : number;
    this.postService.filter(this.selectedValue,this.filter).subscribe((posts)  => {
      this.posts = posts
      console.log(posts);
    });
  }
  withTags(){
    this.postService.filter(this.selectedValue,this.filter).subscribe(posts => {
      this.posts = posts;
    })
  }
  asOneRepInQuestion(question: Post): boolean{
    console.log(question);
      question.reponses.forEach(response => {
        if(response.user.id == this.CurrentUser.id){
          console.log("test");
          return true;
        }
      });
    return false;
  }
  delete(post: Post){
    const snackBarRef = this.snackBar.open(` Post will be deleted`, 'Undo', { duration: 5000 });
    snackBarRef.afterDismissed().subscribe(res => {
      if (!res.dismissedByAction){
        this.postService.deletePost(post).subscribe();
        this.refresh();
      }
      else
        this.refresh();
    });
  }
  refresh(){
    this.postService.getAll().subscribe(posts => {
      this.posts = posts;
      this.CurrentUser = this.authService.currentUser;
    })
  }
}