import { Component, OnInit,AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostService } from 'src/app/services/post.service';
import { MatDialog,MatSnackBar} from '@angular/material';
import {Comment} from '../../models/Comment';
import { EditCommentComponent } from '../edit-comment/edit-comment.component';
import { Post } from 'src/app/models/Post';
import { commentService } from 'src/app/services/comment.service';
import * as _ from 'lodash';




@Component({
  templateUrl: './readquestion.component.html',
})
export class ReadQuestion implements OnInit {
  question: Post;
  acceptedPost: Post;
  demo = "# Angular 6";
  constructor(
    private route: ActivatedRoute,
    private service: PostService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public comservice: commentService
    ) 
    { 

    }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.service.getById(id).subscribe(post => {
      this.question = post;
      if(this.question.acceptedPostId != null){
        this.service.getRepById(this.question.acceptedPostId).subscribe(post => {
          this.acceptedPost = post;
        });
      }
    });
    
    ;
  }
  refresh(){
    let id = this.route.snapshot.paramMap.get('id');
    this.service.getById(id).subscribe(post => {
      this.question = post;
      if(this.question.acceptedPostId != null){
        this.service.getRepById(this.question.acceptedPostId).subscribe(post => {
          this.acceptedPost = post;
        });
      }
    });
  }
  edit(comment: Comment){
    const dlg = this.dialog.open(EditCommentComponent, { data: { comment, isNew: false },height: '800px',width: '600px',},);
        dlg.beforeClose().subscribe(res => {
            console.log(res);
            if (res) {
                _.assign(comment, res);
                this.comservice.update(comment).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                });
            }
        });
  }

}