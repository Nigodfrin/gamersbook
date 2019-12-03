import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


@Component({
    templateUrl: './edit-comment.component.html',
  })
  export class EditCommentComponent {
    public frm: FormGroup;
    public ctlBody: FormControl;
    public isNew: boolean;

    constructor(public dialogRef: MatDialogRef<EditCommentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { comment: Comment; isNew: boolean; },
        private fb: FormBuilder,
    ){
        this.ctlBody = this.fb.control('');
        this.frm = this.fb.group({
            body: this.ctlBody,
        }, {});
        this.isNew = data.isNew;
        this.frm.patchValue(data.comment);
    }
    update() {
        this.dialogRef.close(this.frm.value);
    }
    cancel() {
        this.dialogRef.close();
    }
  }