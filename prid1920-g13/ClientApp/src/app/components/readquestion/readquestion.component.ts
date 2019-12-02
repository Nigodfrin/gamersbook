import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostService } from 'src/app/services/post.service';
import { MatDialog,MatSnackBar} from '@angular/material';
import {Comment} from '../../models/Comment';
import { EditCommentComponent } from '../edit-comment/edit-comment.component';



@Component({
  templateUrl: './readquestion.component.html',
})
export class ReadQuestion implements OnInit {
  question: any;
  demo = "# Angular 6";
  constructor(
    private route: ActivatedRoute,
    private service: PostService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.service.getById(id).subscribe(post => {
      this.question = post;
      console.log(this.question);
    });
    ;
  }
  edit(comment: Comment){
    const dlg = this.dialog.open(EditCommentComponent, { data: { comment, isNew: false },height: '800px',width: '600px',},);
        // dlg.beforeClose().subscribe(res => {
        //     console.log(res);
            // if (res) {
            //     _.assign(comment, res);
                // this.userService.update(user).subscribe(res => {
                //     if (!res) {
                //         this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                //         this.refresh();
                //     }
                // });
        //     }
        // });
  }

}