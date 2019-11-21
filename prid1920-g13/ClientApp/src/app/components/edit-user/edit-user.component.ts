import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash';
import {AsyncValidatorFn} from "@angular/forms";
import { User, Role } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
    selector: 'app-edit-user-mat',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
    public frm: FormGroup;
    public ctlPseudo: FormControl;
    public ctlPassword: FormControl;
    public ctlFirstname: FormControl;
    public ctlLastname: FormControl;
    public ctlBirthDate: FormControl;
    public ctlRole: FormControl;
    public ctlEmail: FormControl;
    public isNew: boolean;
    constructor(public dialogRef: MatDialogRef<EditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User; isNew: boolean; },
        private fb: FormBuilder,
        private userService: UserService,
        private authService: AuthenticationService
    ) {
        this.ctlPseudo = this.fb.control('', [Validators.required,Validators.minLength(3),this.forbiddenValue('abc')], [this.pseudoUsed()]);
        this.ctlPassword = this.fb.control('', data.isNew ? [Validators.required, Validators.minLength(3)] : []);
        this.ctlFirstname = this.fb.control('', [Validators.minLength(3),Validators.maxLength(50)]);
        this.ctlLastname = this.fb.control('',[Validators.minLength(3),Validators.maxLength(50)]);
        // this.ctlBirthDate = this.fb.control('', []);
        this.ctlBirthDate = this.fb.control('', [this.validateBirthDate()]);
        this.ctlRole = this.fb.control(Role.Member, []);
        this.ctlEmail = this.fb.control('',[Validators.email,Validators.required],[this.isEmailExist()]);
        this.frm = this.fb.group({
            pseudo: this.ctlPseudo,
            password: this.ctlPassword,
            firstName: this.ctlFirstname,
            lastName: this.ctlLastname,
            birthDate: this.ctlBirthDate,
            role: this.ctlRole,
            email: this.ctlEmail
        }, { validator: this.crossValidations });
        console.log(data);
        this.isNew = data.isNew;
        this.frm.patchValue(data.user);
    }
    // Validateur bidon qui vérifie que la valeur est différente
    forbiddenValue(val: string): any {
        return (ctl: FormControl) => {
            if (ctl.value === val) {
                return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } };
            }
            return null;
        };
    }
    isEmailExist(): AsyncValidatorFn {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    }else if (this.data.user.email == this.ctlEmail.value){
                        resolve(null)
                    }
                     else {
                        this.authService.isEmailAvailable(email).subscribe(res => {
                            console.log(res);
                            resolve(res ? null : { isEmailExist: true });
                        });
                    }
                }, 300);
            });
        };
    }
    validateBirthDate(): any {
        return (ctl: FormControl) => {
            const date = new Date(ctl.value);
            const diff = Date.now() - date.getTime();
            if (diff < 0)
                return { futureBorn: true } 
            var age = new Date(diff).getUTCFullYear() - 1970;
            if (age < 18) 
                return { tooYoung: true };
            return null;
        };
    }
    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre
    pseudoUsed(): any {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const pseudo = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    }else if (this.data.user.pseudo == this.ctlPseudo.value){
                        resolve(null)
                    }
                     else {
                        this.userService.isPseudoAvailable(pseudo).subscribe(user => {
                            resolve(!user ? { pseudoUsed: true } : null);
                        });
                    }
                }, 300);
            });
        };
    }
    crossValidations(group: FormGroup): ValidationErrors{
        if (!group.value) { return null; }
        let lastname: string = group.value.lastname;
        let firstname: string = group.value.firstname;
        if (lastname == "" && firstname != "") {
            return { lastnameError: true };

        } else if (firstname == "" && lastname != "") {
            return { firstnameError: true };
        }
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    update() {
        this.dialogRef.close(this.frm.value);
    }
    cancel() {
        this.dialogRef.close();
    }
}