import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, PageEvent, MatSortHeader } from '@angular/material';
import * as _ from 'lodash';
import { User } from '../../models/User';
import { UserService } from '../../services/user.service';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
    selector: 'app-userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.css'],
})
export class UserListComponent implements AfterViewInit, OnDestroy {

    filter: string = '';
    users: User[] = [];
    filterUsers: User[] = [];
    constructor(
        private userService: UserService,
        private stateService: StateService,
        private router: ActivatedRoute,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private authService: AuthenticationService
    ) {
        
    }
    ngAfterViewInit(): void {
        this.refresh();
    }
    refresh() {
        let name: string;
        this.router.queryParams.subscribe(queryParams => {
            name = queryParams.name;
            if(name){
                this.userService.getUsers(name).subscribe(users => {
                    this.users = users;
                    this.filterUsers = users;
                });
            }
        });
    }
    // appelée chaque fois que le filtre est modifié par l'utilisateur
    filterChanged(filterValue: string) {
        const filter = filterValue.toLowerCase();
        this.filterUsers = _.filter(this.users,user => user.firstName.toLowerCase().includes(filter) || user.lastName.toLowerCase().includes(filter)|| user.pseudo.toLowerCase().includes(filter));
    }
    addFriend(user: User){
        this.userService.addFriend(user).subscribe();
    }
    // appelée quand on clique sur le bouton "edit" d'un membre
    edit(user: User) {
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
    // appelée quand on clique sur le bouton "delete" d'un membre
    delete(user: User) {

        const snackBarRef = this.snackBar.open(`User '${user.pseudo}' will be deleted`, 'Undo', { duration: 10000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.userService.delete(user).subscribe(res => {
                    this.refresh();
                });
        });
    }
    // appelée quand on clique sur le bouton "new user"
    create() {
        const user = new User({});
        const dlg = this.dialog.open(EditUserComponent, { data: { user, isNew: true } });
        dlg.beforeClose().subscribe(res => {
            if (res) {
                this.userService.add(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The user has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                    this.refresh();
                });
            }
        });
    }
    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }
}