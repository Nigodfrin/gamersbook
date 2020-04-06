import { Component, ɵflushModuleScopingQueueAsMuchAsPossible,OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/Post';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/User';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { ActivatedRoute } from '@angular/router';



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
  currentUser: User;
  selectedValue: string = "all";
  filter: string = "" ;
  
  constructor(private postService: PostService,private route: ActivatedRoute, private authService: AuthenticationService,public snackBar: MatSnackBar) { }
  ngOnInit() {
    if(this.route.snapshot.paramMap.get('name')){
      let name = this.route.snapshot.paramMap.get('name');
      this.applyTagFilter(name);
    }
    else {
      this.postService.getAll().subscribe(posts => {
        this.posts = posts;
        this.currentUser = this.authService.currentUser;
      });
    }
  }
  applyTagFilter(name: string) {
    this.selectedValue = "tags";
    this.filter = name;
    this.onValChange();
  }
  onValChange(){
    this.postService.filter(this.selectedValue,this.filter).subscribe(posts => {
      this.posts = posts;
      this.currentUser = this.authService.currentUser;
    })
  }

  asOneRepInQuestion(question: Post): boolean{
    console.log(question);
      question.reponses.forEach(response => {
        if(response.user.id == this.currentUser.id){
          return true;
        }
      });
    return false;
  }
  delete(post: Post){
    const snackBarRef = this.snackBar.open(` Post will be deleted`, 'Undo', { duration: 5000 });
    snackBarRef.afterDismissed().subscribe(res => {
      if (!res.dismissedByAction){
        this.postService.deletePost(post).subscribe(res =>{
          this.refresh();
        });
      }
      else
        this.refresh();
    });
  }
  refresh(){
    this.postService.getAll().subscribe(posts => {
      this.posts = posts;
      this.currentUser = this.authService.currentUser;
    })
  }
  isAuthor(reponse: Post): boolean {
    return this.currentUser && this.currentUser.id === reponse.user.id;
  }
}