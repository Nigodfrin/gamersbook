import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GroupedObservable } from 'rxjs';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
    public frm: FormGroup;
    public ctlPseudo: FormControl;
    public ctlFirstname: FormControl;
    public ctlLastname: FormControl;
    public ctlPassword: FormControl;
    public ctlPasswordConfirm: FormControl;
    public ctlEmail: FormControl;
    public ctlBirthdate: FormControl;

    constructor(
        public authService: AuthenticationService,  // pour pouvoir faire le login
        public router: Router,                      // pour rediriger vers la page d'accueil en cas de login
        private fb: FormBuilder                     // pour construire le formulaire, du côté TypeScript
    ) 
    {
        this.ctlPseudo = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.pseudoUsed()]);
        this.ctlPassword = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
        this.ctlFirstname = this.fb.control('', [Validators.minLength(3), Validators.maxLength(50)]);
        this.ctlLastname = this.fb.control('', [Validators.minLength(3), Validators.maxLength(50)]);
        this.ctlPasswordConfirm = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
        this.ctlEmail = this.fb.control('', [Validators.email, Validators.required], [this.emailUsed()]);
        this.ctlBirthdate = this.fb.control('', [this.isAdult()]);
        this.frm = this.fb.group({
            pseudo: this.ctlPseudo,
            firstname: this.ctlFirstname,
            password: this.ctlPassword,
            passwordConfirm: this.ctlPasswordConfirm,
            lastname: this.ctlLastname,
            email: this.ctlEmail,
            birthdate: this.ctlBirthdate,
        }, { validator: this.crossValidations });
    }

    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre.
    // Grâce au setTimeout et clearTimeout, on ne déclenche le service que s'il n'y a pas eu de frappe depuis 300 ms.
    pseudoUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const pseudo = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.authService.isPseudoAvailable(pseudo).subscribe(res => {
                        resolve(res ? null : { pseudoUsed: true });
                    });
                }, 300);
            });
        };
    }
    isAdult(): ValidatorFn {
        return (control: FormControl) => {
            const bdate = new Date(control.value);
            const today = new Date(Date.now());
            let age = today.getFullYear() - bdate.getFullYear();
            if(bdate.getMonth() > today.getMonth() || bdate.getDay() > today.getDay()){
                --age;
            }
            return age >= 18 ? null : { isAdult: true };
        };
    }
    emailUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.authService.isEmailAvailable(email).subscribe(res => {
                        resolve(res ? null : { emailUsed: true });
                    });
                }, 300);
            });
        };
    }
    crossValidations(group: FormGroup): ValidationErrors {
        if (!group.value) { return null; }
        let lastname: string = group.value.lastname;
        let firstname: string = group.value.firstname;
        if (lastname == "" && firstname != "") {
            return { lastnameError: true };

        } else if (firstname == "" && lastname != "") {
            return { firstnameError: true };
        }
        return group.value.password === group.value.passwordConfirm ? null : { passwordNotConfirmed: true };
    }

    signup() {
        this.authService.signup(this.ctlPseudo.value, this.ctlPassword.value).subscribe(() => {
            if (this.authService.currentUser) {
                // Redirect the user
                this.router.navigate(['/']);
            }
        });
    }
}
