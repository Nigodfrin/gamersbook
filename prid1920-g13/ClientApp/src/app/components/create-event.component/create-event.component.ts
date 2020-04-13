import { startWith, map } from "rxjs/operators";
import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from "@angular/core";
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from "@angular/material";
import { COMMA } from "@angular/cdk/keycodes";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { User } from "src/app/models/User";
import { StoreService } from "../Store/store.service";
import { ApiService } from "../Store/api-store.service";
import { UserService } from "src/app/services/user.service";
import { NgbDateAdapter, NgbDate, NgbDateNativeAdapter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";


@Component({
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateEventComponent implements OnInit {

    @ViewChild('friendsInput', { static: false }) friendsInput: ElementRef<HTMLInputElement>;
    @ViewChild('friends', { static: false }) matAutocomplete: MatAutocomplete;
    
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = false;
    separatorKeysCodes: number[] = [COMMA];
    ctrlFriends = new FormControl();
    filteredFriends: Observable<User[]>;
    nFriends: User[] = [];
    allFriends: User[] = [];
    startDate: FormControl;
    endDate: FormControl;
    today = new Date(Date.now());
  
    public frm: FormGroup;
    public ctlDesc: FormControl;
    public ctlName: FormControl;
    public ctlType: FormControl;
    public ctlNumber: FormControl;
    public ctlTimepickerStart: FormControl;
    public ctlTimepickerEnd: FormControl;
    public isNew: boolean;
    public tmpBody: string;
    public tmpTitle: string;

    public start: NgbDateStruct;


    types: string[] = ['Public','Friends Only','Some Friend']

    constructor(private nbdAdapter: NgbDateNativeAdapter,private userServ: UserService,private fb: FormBuilder){
      this.start = this.nbdAdapter.fromModel(new Date(Date.now()));
      this.startDate = fb.control(this.start,[Validators.required]);
      this.endDate = fb.control('',[Validators.required]);
      this.ctlName = fb.control('',Validators.required);
      this.ctlDesc = fb.control('',Validators.required);
      this.ctlType = fb.control('',Validators.required);
      this.ctlNumber = fb.control('',Validators.required);
      this.ctlTimepickerStart = fb.control({hour: 13, minute: 30},[]);
      this.ctlTimepickerEnd = fb.control({hour: 14, minute: 30},[]);
      this.filteredFriends = this.ctrlFriends.valueChanges.pipe(
        startWith(null),
        map((user: string | null) => user ? this._filter(user) : this.allFriends.slice()));
    }
    ngOnInit(): void {
      
      this.userServ.getFriend().subscribe(res => {
        this.allFriends = res;
      })
      this.frm = this.fb.group({
        description: this.ctlDesc,
        name: this.ctlName,
        users: this.ctrlFriends,
        start_date: this.startDate,
        end_date: this.endDate,
        nbUsers: this.ctlNumber,
        tyep: this.ctlType,
      }, {});
    }
    addTontags(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
      const x = this.allFriends.find(user => user.pseudo.toLowerCase() == value.trim().toLowerCase());
      if((value || '').trim() && x) {
        this.nFriends.push(x);
        this.allFriends = _.remove(this.allFriends,user => user.pseudo != value.trim());
      }
      else {
        this.ctrlFriends.setErrors({invalidInput: true});
      }
      if (input) {
        input.value = '';
      }
      if(this.ctrlFriends.valid){
        this.ctrlFriends.setValue(null);
      }
  }

  remove(user: User): void {
    const index = this.nFriends.indexOf(user);
    if (index >= 0) {
      this.nFriends.splice(index, 1);
      this.allFriends.push(user);
      this.ctrlFriends.markAsDirty();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const user = this.allFriends.find(user => user.pseudo.toLowerCase() == event.option.viewValue.toLowerCase());
    const index = this.allFriends.indexOf(user);
    this.nFriends.push(user);
    this.allFriends.splice(index,1);
    this.friendsInput.nativeElement.value = '';
    this.ctrlFriends.setValue(null);
    console.log("test",this.allFriends);
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.allFriends.filter(user => user.pseudo.toLowerCase().indexOf(filterValue) === 0);
  }
}