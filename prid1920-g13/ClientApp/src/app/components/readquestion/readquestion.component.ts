import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Comment } from '../../models/Comment';
import { EditCommentComponent } from '../edit-comment/edit-comment.component';
import { Post } from 'src/app/models/Post';
import { commentService } from 'src/app/services/comment.service';
import * as _ from 'lodash';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Vote } from 'src/app/models/Vote';
import { VoteService } from '../../services/vote.service';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';



@Component({
  templateUrl: './readquestion.component.html',
})
export class ReadQuestion implements OnInit {
  question: Post;
  reponses: Post[];
  acceptedPost: Post;
  Answer: string = "";
  votes: Vote[];
  currentUser: User;
  postInEdit: Post;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private service: PostService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public comservice: commentService,
    private voteService: VoteService
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.authService.currentUser;
    this.service.getById(id).subscribe(post => {
      this.question = post;
      if (this.question.acceptedPostId != null) {
        this.service.getRepById(this.question.acceptedPostId).subscribe(post => {
          this.acceptedPost = post;
          this.service.getAllRep(this.question.id, this.acceptedPost.id).subscribe(posts => {
            this.reponses = posts;
          });
        });
      }
      else {
        this.reponses = this.question.reponses;
      }

    });
    ;
  }
  refresh() {
    let id = this.route.snapshot.paramMap.get('id');
    this.service.getById(id).subscribe(post => {
      this.question = post;
      console.log(post);
      if (this.question.acceptedPostId != null) {
        this.service.getRepById(this.question.acceptedPostId).subscribe(post => {
          this.acceptedPost = post;
          this.service.getAllRep(this.question.id, this.acceptedPost.id).subscribe(posts => {
            this.reponses = posts;
          })
        });
      }
      else {
        this.reponses = this.question.reponses;
      }
    });
  }
  edit(comment: Comment) {
    const dlg = this.dialog.open(EditCommentComponent, { data: { comment, isNew: false }, height: '800px', width: '600px', });
    dlg.beforeClose().subscribe(res => {
      if (res) {
        _.assign(comment, res);
        this.comservice.update(comment).subscribe(res => {
          if (!res) {
            this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            this.refresh();
            this.question.acceptedPostId = null;
          }
          else {
            this.refresh();
          }
        });
      }
    });
  }
  delete(comment: Comment) {
    this.question.comments = _.filter(this.question.comments, m => m.id !== comment.id);
    this.reponses.forEach(post => {
      post.comments = _.filter(post.comments, m => m.id !== comment.id);
    })
    const snackBarRef = this.snackBar.open(` Comment will be deleted`, 'Undo', { duration: 5000 });
    snackBarRef.afterDismissed().subscribe(res => {
      if (!res.dismissedByAction)
        this.comservice.delete(comment).subscribe();
      else
        this.refresh();
    });
  }
  deleteRep(response: Post) {
    const snackBarRef = this.snackBar.open(` Response will be deleted`, 'Undo', { duration: 5000 });
    snackBarRef.afterDismissed().subscribe(res => {
      if (!res.dismissedByAction){
        this.service.delete(response).subscribe();
        this.refresh();
      }
      else
        this.refresh();
    });
  }
  cancel() {
    this.Answer = "";
  }
  send() {
    var answer: Post;
    // dans le cas où on ajoute un post
    console.log(this.postInEdit);
    if(this.postInEdit == null && this.postInEdit == undefined){
     answer = new Post(
        {
          body: this.Answer,
          parentId: this.question.id,
          user: this.currentUser,
          timestamp: new Date(Date.now()),
        }
        );
    }
    else{
      // si on veut update
      answer = this.postInEdit;
      answer.body = this.Answer;
      this.postInEdit = null;
    } 
    this.service.addPost(answer).subscribe(res => {
      if (!res) {
        this.snackBar.open(`There was an error at the server. The user has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
        this.refresh();
      }
      else {
        this.refresh();
        this.Answer = '';
      }
    });
  }
  editAnswer(post: Post){
    this.postInEdit = post;
    this.Answer = post.body;
    window.scrollTo(0,document.body.scrollHeight);
  }
  addVote(postid: number, upVote: number) {
    if(this.currentUser != undefined){
    let err = false;
    this.voteService.getVotes(postid).subscribe(votes => {
      votes.forEach(vote => {
        if (vote.upDown == upVote && vote.postId == postid && vote.authorId == this.authService.currentUser.id) {
          const snackBarData = this.snackBar.open(`You're about to cancel your vote`, 'Undo', { duration: 5000 });
          snackBarData.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction) {
              this.voteService.delete(vote).subscribe();
              this.refresh();
            }
            else {
              console.log(10);
              this.refresh();
            }
          });
          err = true;
        }
      });
      if (!err) {
        const vote = new Vote({ authorId: this.authService.currentUser.id, postId: postid, upDown: upVote });
        this.voteService.add(vote).subscribe(res => {
          this.refresh();
        });
      }
    });
  }
}
  acceptAnswer(question: Post, acceptedPost: Post) {
    this.acceptedPost = null;
    this.service.putAcceptedPost(question,acceptedPost.id).subscribe(res => {
      this.acceptedPost = acceptedPost;
      this.refresh();
    });
  }
  addComment(postId: number){
    const comment = new Comment({});
    const dlg = this.dialog.open(EditCommentComponent, { data: { comment,isNew: true }, height: '600px', width: '600px', });
    dlg.beforeClose().subscribe(res => {
      if (res) {
        _.assign(comment, res);
        comment.author = this.currentUser;
        comment.postId = postId;
        comment.timestamp = new Date(Date.now());
        this.comservice.addComment(comment).subscribe(res => {
          if (!res) {
            this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            this.refresh();
          }
          else {
            this.refresh();
          }
        });
      }
    });
  }
}