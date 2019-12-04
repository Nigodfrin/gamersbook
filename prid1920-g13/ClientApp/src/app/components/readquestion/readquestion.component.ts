import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostService } from 'src/app/services/post.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Comment } from '../../models/Comment';
import { EditCommentComponent } from '../edit-comment/edit-comment.component';
import { Post } from 'src/app/models/Post';
import { commentService } from 'src/app/services/comment.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';




@Component({
  templateUrl: './readquestion.component.html',
})
export class ReadQuestion implements OnInit {
  question: Post;
  reponses: Post[];
  acceptedPost: Post;
  ctlAnswer: FormControl;
  frm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private service: PostService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public comservice: commentService,
    private fb: FormBuilder
  ) {
    this.ctlAnswer = this.fb.control('');
    this.frm = this.fb.group({
        body: this.ctlAnswer,
        timestamp: Date.now(),
        user: authService.currentUser
    }, {});
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.service.getById(id).subscribe(post => {
      this.question = post;
      // this.reponses = this.question.reponses;
      if (this.question.acceptedPostId != null) {
        this.service.getRepById(this.question.acceptedPostId).subscribe(post => {
          this.acceptedPost = post;
          this.service.getAllRep(this.question.id,this.acceptedPost.id).subscribe(posts => {
            this.reponses = posts;
          });
        });
      }

    });

    ;
  }
  refresh() {
    let id = this.route.snapshot.paramMap.get('id');
    this.service.getById(id).subscribe(post => {
      this.question = post;
      // this.reponses = this.question.reponses;
      if (this.question.acceptedPostId != null) {
        this.service.getRepById(this.question.acceptedPostId).subscribe(post => {
          this.acceptedPost = post;
          this.service.getAllRep(this.question.id,this.acceptedPost.id).subscribe(posts => {
            this.reponses = posts;
          })
        });
      }
    });
  }
  edit(comment: Comment) {
    const dlg = this.dialog.open(EditCommentComponent, { data: { comment, isNew: false }, height: '800px', width: '600px', });
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
  delete(comment: Comment) {
    const backupQuestionCom = this.question.comments ;
    const backupRepCom = [];
    this.question.comments = _.filter(this.question.comments, m => m.id !== comment.id);
    this.reponses.forEach(post => {
      backupRepCom.push(post.comments);
      post.comments =  _.filter(post.comments, m => m.id !== comment.id);
    })
        const snackBarRef = this.snackBar.open(` Comment will be deleted`, 'Undo', { duration: 10000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.comservice.delete(comment).subscribe();
            else
                this.question.comments = backupQuestionCom;
                this.reponses.forEach(post =>{
                  backupRepCom.forEach(tabCom =>{
                    post.comments = tabCom;
                  })
                })
        });
  }
  cancel(){
    this.ctlAnswer.setValue("");
  }
  send(){
    const answer = new Post(this.frm.value);
    this.reponses.push(answer);
    this.service.addPost(answer).subscribe(res => {
      if (!res) {
          this.snackBar.open(`There was an error at the server. The user has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
          this.refresh();
      }
  });
  }

}