import { Component, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
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
import { GameService } from 'src/app/services/game.service';
import { Game } from 'src/app/models/Game';
import { ActivatedRoute } from '@angular/router';


@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ProfileComponent implements OnInit {

    userProfile: User;
    friends: User[];
    userPostsRep: Post[];
    userPostsQuest: Post[];
    userGames: Game[];
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
    userId: any;
    public snackBar: MatSnackBar;
    @ViewChild(ImageCropperComponent, { static: true }) imageCropper: ImageCropperComponent;

    constructor(private fb: FormBuilder,private router: ActivatedRoute,private gameService: GameService, private authService: AuthenticationService, private dialog: MatDialog, private userService: UserService) {
        if(this.router.snapshot.paramMap.get('id')){
            this.userId = this.router.snapshot.paramMap.get('id');
            this.userService.getById(this.userId).subscribe(res => {
                this.userProfile = res;
            });
        }
        else {
            this.userId = this.authService.currentUser.id;
            this.userProfile = this.authService.currentUser;
            this.picture = this.userProfile.picturePath ? this.userProfile.picturePath : 'uploads/unknown-user.jpg';
        }
    }

    ngOnInit(): void {
        this.userService.getUserPostQuest(this.userId).subscribe(questions => {
            this.userPostsQuest = questions;
        });
        this.userService.getUserPostRep(this.userId).subscribe(reponses => {
            this.userPostsRep = reponses
        });
        this.userService.getUserComment(this.userId).subscribe(comments => {
            this.userComment = comments
        });
        this.userService.getUserGames(this.userProfile.pseudo).subscribe(games => {
            this.userGames = games;
        });
        this.refreshGetFriends();
    }
    refreshGetFriends(){
        this.userService.getFriend().subscribe(amis => {
            this.friends = amis;
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
    deleteFriend(friend: User){
        this.userService.deleteFriend(friend.id).subscribe(res => {
            this.refreshGetFriends();
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