import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/models/Post';
import { Comment } from 'src/app/models/Comment';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { MatDialog, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import { ImageCroppedEvent, CropperPosition, ImageCropperComponent } from 'ngx-image-cropper';
import { SourceListMap } from 'source-list-map';
import { constructor } from 'lodash';


@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    userProfile: User;
    userPostsRep: Post[];
    userPostsQuest: Post[];
    userComment: Comment[];
    picture: string;
    ctlPseudo: FormControl;
    ctlPassword: FormControl;
    ctlFirstname: FormControl;
    ctlLastname: FormControl;
    ctlPasswordConfirm: FormControl;
    ctlEmail: FormControl;
    ctlBirthdate: FormControl;
    frm: FormGroup;
    public snackBar: MatSnackBar;
    @ViewChild(ImageCropperComponent, { static: true }) imageCropper: ImageCropperComponent;

    constructor(private fb: FormBuilder, private authService: AuthenticationService, private dialog: MatDialog, private userService: UserService) {
        this.userProfile = this.authService.currentUser;
        this.picture = this.userProfile.picturePath ? this.userProfile.picturePath : 'uploads/unknown-user.jpg';
    }

    ngOnInit(): void {
        this.userService.getUserPostQuest().subscribe(questions => {
            this.userPostsQuest = questions;
        });
        this.userService.getUserPostRep().subscribe(reponses => {
            this.userPostsRep = reponses
        });
        this.userService.getUserComment().subscribe(comments => {
            this.userComment = comments
        });

    }
    refresh() {
        this.userProfile = this.authService.currentUser;
        this.picture = this.userProfile.picturePath ? this.userProfile.picturePath : 'uploads/unknown-user.jpg';
    }
    edit() {
        let user = this.userProfile;
        const dlg = this.dialog.open(EditUserComponent, { data: { user, isNew: false } });
        dlg.beforeClose().subscribe(res => {
            if (res) {
                _.assign(user, res);
                this.userService.update(user).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                    this.refresh();
                });
            }
        });
    }
    fileChangeEvent(event: any): void {
        console.log(event);
        const dlg = this.dialog.open(DialogCropper, {
            width: '1000px',
            height: '900px',
            data: event
        });
        dlg.beforeClose().subscribe(res => {
            this.srcToFile(res, 'test.jpg', 'image/jpg').then(file => {
                this.userService.uploadPicture(this.userProfile.pseudo || 'empty', file).subscribe(path => {
                    this.userService.confirmPicture(this.userProfile.pseudo, path).subscribe();
                    this.authService.currentUser.picturePath = 'uploads/' + this.userProfile.pseudo + '.jpg';
                    this.userService.update(this.userProfile).subscribe(res => {
                        if (!res) {
                            this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                            this.refresh();
                        }
                        this.refresh();
                    });
                });
            });

        });
    }
    srcToFile(src, fileName, mimeType) {
        return (fetch(src)
            .then(function (res) { return res.arrayBuffer(); })
            .then(function (buf) { return new File([buf], fileName, { type: mimeType }); })
        );
    }

}
@Component({
    selector: 'dialog-Cropper',
    templateUrl: 'dialog-cropper.component.html',
})
export class DialogCropper {
    croppedImage: any = '';
    imageChangedEvent: any = '';

    constructor(
        public dialogRef: MatDialogRef<DialogCropper>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.imageChangedEvent = event;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
    imageCropped(event: ImageCroppedEvent) {
        console.log(event);
        this.croppedImage = event.base64;
    }
    save() {

        this.dialogRef.close(this.croppedImage);
    }
    imageLoaded() {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

}