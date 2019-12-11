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

  constructor(private postService: PostService, private authService: AuthenticationService,public snackBar: MatSnackBar) { }
  ngOnInit() {
    this.postService.getAll().subscribe(posts => {
      this.posts = posts;
      console.log(posts);
      this.CurrentUser = this.authService.currentUser;
    })

  }
  newest() {
      this.postService.getNewest().subscribe(posts => {
        this.posts = posts;
      })
  }
  unanswered(){
    this.postService.getNonAnswered().subscribe(posts => {
      this.posts = posts;
    })
  }
  votes() {
    var s : number;
    this.postService.getOrderByVotes().subscribe((posts)  => {
      this.posts = posts
      console.log(posts);
    });
  }
  withTags(){
    this.postService.getWithTags().subscribe(posts => {
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
    const snackBarRef = this.snackBar.open(` Comment will be deleted`, 'Undo', { duration: 5000 });
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