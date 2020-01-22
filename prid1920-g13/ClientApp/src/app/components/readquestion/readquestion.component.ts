import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PostService } from 'src/app/services/post.service';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
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
  styleUrls: ['./readquestion.component.css'],
})
export class ReadQuestion implements OnInit {
  question: Post;
  votes: Vote[];
  currentUser: User;
  dlg: MatDialogRef<any>;
  
  Answer: string = "";
  postInEdit: Post;
  @ViewChild('defaultDialogButtons', { static: false })
  private defaultDialogButtonsTpl: TemplateRef<any>;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private service: PostService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public comservice: commentService,
    public userservice: UserService,
    private voteService: VoteService
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.authService.currentUser;
    this.service.getById(id).subscribe(post => {
      this.question = post;
    });
    ;
  }
  refresh() {
    let id = this.route.snapshot.paramMap.get('id');
    this.service.getById(id).subscribe(post => {
      this.question = post;
    });
  }
  // Fonction en rapport avec les réponses 
  removeAcceptAnswer(question: Post) {
    const snackBarRef = this.snackBar.open(` This accepted answer will be deleted`, 'Undo', { duration: 5000 });
    snackBarRef.afterDismissed().subscribe(res => {
      if (!res.dismissedByAction) {
        this.service.removeAcceptAnswer(question).subscribe(question => {
          this.question = question;
        });
      }
      else
        this.refresh();
    });
  }
  acceptAnswer(acceptedPost: Post) {
    this.service.putAcceptedPost(this.question, acceptedPost.id).subscribe(res => {
      this.userservice.changeReput(acceptedPost.user.id, this.question.user.id).subscribe();
      this.question = res;
    });
  }
  isAuthor(reponse: Post): boolean {
    return this.authService.currentUser && this.authService.currentUser.id === reponse.user.id;
  }
  deleteRep(response: Post) {
    const snackBarRef = this.snackBar.open(` Response will be deleted`, 'Undo', { duration: 5000 });
    snackBarRef.afterDismissed().subscribe(res => {
      if (!res.dismissedByAction) {
        this.service.delete(response).subscribe(res => {
        this.refresh();
        });
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
    if (this.postInEdit == null && this.postInEdit == undefined) {
      answer = new Post(
        {
          body: this.Answer,
          parentId: this.question.id,
          user: this.authService.currentUser,
          timestamp: new Date(Date.now()),
        }
      );
    }
    else {
      // si on veut update
      answer = this.postInEdit;
      answer.body = this.Answer;
      this.postInEdit = null;
    }
    this.service.addPost(answer).subscribe(res => {
      if (!res) {
        this.snackBar.open(`There was an error at the server. The answer has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
        this.refresh();
        
      }
      else {
        this.refresh();            
        this.Answer = '';
      }
    });
  }
  editAnswer(post: Post) {
    this.postInEdit = post;
    this.Answer = post.body;
    window.scrollTo(0, document.body.scrollHeight);
  }
  // fonction en rapport avec les commentaires

  // Fonctions en rapport avec les votes
  addVote(postid: number, upVote: number) {
    if (this.currentUser != undefined) {
      let err = false;
      this.voteService.getVotes(postid).subscribe(votes => {
        votes.forEach(vote => {
          if (vote.upDown == upVote && vote.postId == postid && vote.authorId == this.authService.currentUser.id) {
            const snackBarData = this.snackBar.open(`You're about to cancel your vote`, 'Undo', { duration: 5000 });
            snackBarData.afterDismissed().subscribe(res => {
              if (!res.dismissedByAction) {
                this.voteService.delete(vote).subscribe(res => {
                  this.refresh();
                });
              }
              else {
                this.refresh();
              }
            });
            err = true;
          }
        });
        if (!err) {
          upVote == -1 ? this.currentUser.reputation += -1 : null;
          const vote = new Vote({ authorId: this.authService.currentUser.id, postId: postid, upDown: upVote });
          this.voteService.add(vote).subscribe(res => {
            this.userservice.changeReputVote(vote.postId, vote.upDown).subscribe();
            this.refresh();
          });
        }
      });
    }
    else {
      this.openConnectionDialog();
    }
  }
  openConnectionDialog() {
    this.dlg = this.dialog.open(this.defaultDialogButtonsTpl, { height: '175px', width: '500px', });

  }
  closeDialog() {
    this.dlg.close();
  }




}