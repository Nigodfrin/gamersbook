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
import { AuthenticationService } from "src/app/services/authentication.service";
import { Game } from "src/app/models/Game";
import { EventGame } from "src/app/models/EventGame";
import { EventData } from "src/app/models/EventData";
import { EventGameService } from "src/app/services/event.service";


@Component({
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateEventComponent implements OnInit {

    @ViewChild('friendsInput', { static: false }) friendsInput: ElementRef<HTMLInputElement>;
    @ViewChild('friends', { static: false }) matAutocomplete: MatAutocomplete;
    @ViewChild('gameInput', { static: false }) gameInput: ElementRef<HTMLInputElement>;
    @ViewChild('games', { static: false }) GamesMatAutocomplete: MatAutocomplete;
    
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
    games: Game[] = [];
    filteredGames: Observable<Game[]>;
    langages =  ['Afar ','Abkhaze','Avestique','Afrikaans','Akan','Amharique','Aragonais','Arabe','Assamais','Avar',
    'Aymara','Azéri','Bachkir','Biélorusse','Bulgare','Bihari','Bichelamar','Bambara','Bengali','Tibétain','Breton','Bosnien','Catalan',
    'Tchétchène','Chamorro','Corse','Cri','Tchèque','Vieux-slave','Tchouvache','Gallois','Danois','Allemand','Maldivien','Dzongkha','Ewe','Grec moderne','Anglais','Espéranto',
    'Espagnol','Estonien','Basque','Persan','Peul','Finnois','Fidjien','Féroïen','Français','Frison occidental','Irlandais','Écossais','Galicien','Guarani','Gujarati',
    'Mannois','Haoussa','Hébreu','Hindi','Hiri motu','Croate','Créole haïtien','Hongrois','Arménien','Héréro',
    'Interlingua','Indonésien','Occidental','Igbo','Yi','Inupiak','Ido','Islandais','Italien',
    'Inuktitut','Japonais','Javanais','Géorgien','Kikongo','Kikuyu','Kuanyama','Kazakh','Groenlandais','Khmer','Kannada','Coréen','Kanouri','Cachemiri','Kurde','Komi','Cornique',
    'Kirghiz','Latin','Luxembourgeois','Ganda','Limbourgeois','Lingala',
    'Lao','Lituanien','Luba-katanga','Letton','Malgache','Marshallais','Maori de Nouvelle-Zélande',
    'Macédonien','Malayalam','Mongol','Moldave','Marathi','Malais','Maltais','Birman','Nauruan','Norvégien Bokmål','Sindebele','Népalais','Ndonga','Néerlandais','Norvégien Nynorsk',
    'Norvégien','Nrebele','Navajo','Chichewa','Occitan','Ojibwé','Oromo','Oriya','Ossète','Pendjabi','Pali','Polonais','Pachto','Portugais','Quechua','Créole Réunionnais',
    'Romanche','Kirundi','Roumain','Russe','Kinyarwanda','Sanskrit','Sarde','Sindhi','Same du Nord','Sango','Serbo-croate','Cingalais',
    'Slovaque','Slovène','Samoan','Shona','Somali','Albanais','Serbe','Swati','Sotho du Sud','Soundanais',
    'Suédois','Swahili','Tamoul','Télougou','Tadjik','Thaï','Tigrigna','Turkmène','Tagalog','Tswana','Tongien','Turc','Tsonga','Tatar','Twi','Tahitien','Ouïghour','Ukrainien',
    'Ourdou','Ouzbek','Venda','Vietnamien','Volapük','Wallon','Wolof','Xhosa','Yiddish','Yoruba','Zhuang','Chinois',
    'Zoulou']
  
    public frm: FormGroup;
    public ctlDesc: FormControl;
    public ctlName: FormControl;
    public ctlType: FormControl;
    public ctlGame: FormControl;
    public ctlNumber: FormControl;
    public ctlLang: FormControl;
    public ctlTimepickerStart: FormControl;
    public ctlTimepickerEnd: FormControl;
    public isNew: boolean;
    public tmpBody: string;
    public tmpTitle: string;

    public start: NgbDateStruct;


    types: string[] = ['Public','Friends','ParticularFriend']

    constructor(private eventService: EventGameService,private nbdAdapter: NgbDateNativeAdapter,private userServ: UserService,private fb: FormBuilder,private authServ: AuthenticationService){
      this.start = this.nbdAdapter.fromModel(new Date(Date.now()));
      this.startDate = fb.control(this.start,[Validators.required]);
      this.endDate = fb.control('',[Validators.required]);
      this.ctlName = fb.control('',Validators.required);
      this.ctlDesc = fb.control('',Validators.required);
      this.ctlType = fb.control(0,Validators.required);
      this.ctlNumber = fb.control('',Validators.required);
      this.ctlLang = fb.control('',Validators.required);
      this.ctlGame = fb.control('',Validators.required);
      this.ctlTimepickerStart = fb.control({hour: 13, minute: 30},[]);
      this.ctlTimepickerEnd = fb.control({hour: 14, minute: 30},[]);
      this.filteredFriends = this.ctrlFriends.valueChanges.pipe(
        startWith(null),
        map((user: string | null) => user ? this._filter(user) : this.allFriends.slice()));
      this.filteredGames = this.ctlGame.valueChanges.pipe(
        startWith(null),
        map((name: string | null) => name ? this._filterGame(name) : this.games.slice()));
    }
    ngOnInit(): void {
      this.userServ.getFriend().subscribe(res => {
        this.allFriends = res;
      });
      this.userServ.getUserGames(this.authServ.currentUser.pseudo).subscribe(games => {
        console.log(games);
        this.games = games;
      });
      this.frm = this.fb.group({
        description: this.ctlDesc,
        name: this.ctlName,
        start_date: this.startDate,
        end_date: this.endDate,
        nbUsers: this.ctlNumber,
        eventType: this.ctlType,
        langue: this.ctlLang
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
  private _filterGame(value: string): Game[] {
    const filterValue = value.toLowerCase();
    return this.games.filter(game => game.name.toLowerCase().startsWith(filterValue));
  }
  add(){
const gametm = this.games.find(game => game.name === this.ctlGame.value);
let startdate = this.nbdAdapter.toModel(this.frm.value.start_date);
let enddate = this.nbdAdapter.toModel(this.frm.value.end_date);
    Object.assign(this.frm.value,{start_date:startdate,end_date: enddate});
    console.log(this.frm.value);
    const eg = new EventGame(this.frm.value);
    const ev = Object.assign({},{eventGame:eg},{game:gametm},{participants: this.nFriends});
    const eventData = new EventData(ev);
    this.eventService.createEvent(eventData).subscribe();
    console.log(eventData);
  }

}