import { startWith, map } from "rxjs/operators";
import * as _ from 'lodash';
import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from "@angular/core";
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from "@angular/material";
import { COMMA } from "@angular/cdk/keycodes";
import { FormControl, FormGroup, FormBuilder, Validators, ValidationErrors } from "@angular/forms";
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
import { Notif, NotificationTypes } from "src/app/models/Notif";
import { NotifsService } from "src/app/services/notifs.service";
import { AccessType, Event } from "src/app/models/Event";
import { SignalRService } from "src/app/services/signalR.service";


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
  langages = [{ iso: 'aa', name: 'Afar' }, { iso: 'ab', name: 'Abkhazian' }, { iso: 'ae', name: 'Avestan' }, { iso: 'af', name: 'Afrikaans' }, { iso: 'ak', name: 'Akan' }, { iso: 'am', name: 'Amharic' }, { iso: 'an', name: 'Aragonese' }, { iso: 'ar', name: 'Arabic' }, { iso: 'as', name: 'Assamese' }, { iso: 'av', name: 'Avaric' }, { iso: 'ay', name: 'Aymara' }, { iso: 'az', name: 'Azerbaijani' }, { iso: 'ba', name: 'Bashkir' }, { iso: 'be', name: 'Belarusian' }, { iso: 'bg', name: 'Bulgarian' }, { iso: 'bh', name: 'Bihari' }, { iso: 'bi', name: 'Bislama' }, { iso: 'bm', name: 'Bambara' }, { iso: 'bn', name: 'Bengali' }, { iso: 'bo', name: 'Tibetan' }, { iso: 'br', name: 'Breton' }, { iso: 'bs', name: 'Bosnian' }, { iso: 'ca', name: 'Catalan' }, { iso: 'ce', name: 'Chechen' }, { iso: 'ch', name: 'Chamorro' }, { iso: 'co', name: 'Corsican' }, { iso: 'cr', name: 'Cree' }, { iso: 'cs', name: 'Czech' }, { iso: 'cu', name: 'Old Church Slavonic' }, { iso: 'cv', name: 'Chuvash' }, { iso: 'cy', name: 'Welsh' }, { iso: 'da', name: 'Danish' }, { iso: 'de', name: 'German' }, { iso: 'dv', name: 'Divehi' }, { iso: 'dz', name: 'Dzongkha' }, { iso: 'ee', name: 'Ewe' }, { iso: 'el', name: 'Greek' }, { iso: 'en', name: 'English' }, { iso: 'eo', name: 'Esperanto' }, { iso: 'es', name: 'Spanish' }, { iso: 'et', name: 'Estonian' }, { iso: 'eu', name: 'Basque' }, { iso: 'fa', name: 'Persian' }, { iso: 'ff', name: 'Fulah' }, { iso: 'fi', name: 'Finnish' }, { iso: 'fj', name: 'Fijian' }, { iso: 'fo', name: 'Faroese' }, { iso: 'fr', name: 'French' },
  { iso: 'fy', name: 'Western Frisian' }, { iso: 'ga', name: 'Irish' }, { iso: 'gd', name: 'Scottish Gaelic' }, { iso: 'gl', name: 'Galician' }, { iso: 'gn', name: 'Guarani' }, { iso: 'gu', name: 'Gujarati' }, { iso: 'gv', name: 'Manx' }, { iso: 'ha', name: 'Hausa' }, { iso: 'he', name: 'Hebrew' }, { iso: 'hi', name: 'Hindi' },
  { iso: 'ho', name: 'Hiri Motu' }, { iso: 'hr', name: 'Croatian' }, { iso: 'ht', name: 'Haitian' }, { iso: 'hu', name: 'Hungarian' }, { iso: 'hy', name: 'Armenian' }, { iso: 'hz', name: 'Herero' }, { iso: 'ia', name: 'Interlingua' }, { iso: 'id', name: 'Indonesian' }, { iso: 'ie', name: 'Interlingue' }, { iso: 'ig', name: 'Igbo' }, { iso: 'ii', name: 'Sichuan Yi' }, { iso: 'ik', name: 'Inupiaq' }, { iso: 'io', name: 'Ido' }, { iso: 'is', name: 'Icelandic' }, { iso: 'it', name: 'Italian' }, { iso: 'iu', name: 'Inuktitut' }, { iso: 'ja', name: 'Japanese' }, { iso: 'jv', name: 'Javanese' }, { iso: 'ka', name: 'Georgian' }, { iso: 'kg', name: 'Kongo' },
  { iso: 'ki', name: 'Kikuyu' }, { iso: 'kj', name: 'Kwanyama' }, { iso: 'kk', name: 'Kazakh' }, { iso: 'kl', name: 'Greenlandic' }, { iso: 'km', name: 'Khmer' }, { iso: 'kn', name: 'Kannada' }, { iso: 'ko', name: 'Korean' }, { iso: 'kr', name: 'Kanuri' }, { iso: 'ks', name: 'Kashmiri' }, { iso: 'ku', name: 'Kurdish' }, { iso: 'kv', name: 'Komi' }, { iso: 'kw', name: 'Cornish' }, { iso: 'ky', name: 'Kirghiz' }, { iso: 'la', name: 'Latin' }, { iso: 'lb', name: 'Luxembourgish' }, { iso: 'lg', name: 'Ganda' }, { iso: 'li', name: 'Limburgish' }, { iso: 'ln', name: 'Lingala' }, { iso: 'lo', name: 'Lao' }, { iso: 'lt', name: 'Lithuanian' }, { iso: 'lu', name: 'Luba' },
  { iso: 'lv', name: 'Latvian' }, { iso: 'mg', name: 'Malagasy' }, { iso: 'mh', name: 'Marshallese' }, { iso: 'mi', name: 'Māori' }, { iso: 'mk', name: 'Macedonian' }, { iso: 'ml', name: 'Malayalam' }, { iso: 'mn', name: 'Mongolian' }, { iso: 'mo', name: 'Moldavian' }, { iso: 'mr', name: 'Marathi' }, { iso: 'ms', name: 'Malay' }, { iso: 'mt', name: 'Maltese' }, { iso: 'my', name: 'Burmese' }, { iso: 'na', name: 'Nauru' }, { iso: 'nb', name: 'Norwegian Bokmål' }, { iso: 'nd', name: 'North Ndebele' }, { iso: 'ne', name: 'Nepali' }, { iso: 'ng', name: 'Ndonga' }, { iso: 'nl', name: 'Dutch' }, { iso: 'nn', name: 'Norwegian Nynorsk' }, { iso: 'no', name: 'Norwegian' }, { iso: 'nr', name: 'South Ndebele' }, { iso: 'nv', name: 'Navajo' }, { iso: 'ny', name: 'Chichewa' }, { iso: 'oc', name: 'Occitan' },
  { iso: 'oj', name: 'Ojibwa' }, { iso: 'om', name: 'Oromo' }, { iso: 'or', name: 'Oriya' }, { iso: 'os', name: 'Ossetian' }, { iso: 'pa', name: 'Panjabi' }, { iso: 'pi', name: 'Pāli' }, { iso: 'pl', name: 'Polish' }, { iso: 'ps', name: 'Pashto' }, { iso: 'pt', name: 'Portuguese' }, { iso: 'qu', name: 'Quechua' }, { iso: 'rc', name: 'Reunionese' }, { iso: 'rm', name: 'Romansh' }, { iso: 'rn', name: 'Kirundi' }, { iso: 'ro', name: 'Romanian' }, { iso: 'ru', name: 'Russian' }, { iso: 'rw', name: 'Kinyarwanda' }, { iso: 'sa', name: 'Sanskrit' }, { iso: 'sc', name: 'Sardinian' }, { iso: 'sd', name: 'Sindhi' }, { iso: 'se', name: 'Northern Sami' }, { iso: 'sg', name: 'Sango' }, { iso: 'sh', name: 'Serbo-Croatian' }, { iso: 'si', name: 'Sinhalese' }, { iso: 'sk', name: 'Slovak' }, { iso: 'sl', name: 'Slovenian' }, { iso: 'sm', name: 'Samoan' }, { iso: 'sn', name: 'Shona' },
  { iso: 'so', name: 'Somali' }, { iso: 'sq', name: 'Albanian' }, { iso: 'sr', name: 'Serbian' }, { iso: 'ss', name: 'Swati' }, { iso: 'st', name: 'Sotho' }, { iso: 'su', name: 'Sundanese' }, { iso: 'sv', name: 'Swedish' }, { iso: 'sw', name: 'Swahili' }, { iso: 'ta', name: 'Tamil' }, { iso: 'te', name: 'Telugu' }, { iso: 'tg', name: 'Tajik' }, { iso: 'th', name: 'Thai' }, { iso: 'ti', name: 'Tigrinya' }, { iso: 'tk', name: 'Turkmen' }, { iso: 'tl', name: 'Tagalog' }, { iso: 'tn', name: 'Tswana' },
  { iso: 'to', name: 'Tonga' }, { iso: 'tr', name: 'Turkish' }, { iso: 'ts', name: 'Tsonga' }, { iso: 'tt', name: 'Tatar' }, { iso: 'tw', name: 'Twi' }, { iso: 'ty', name: 'Tahitian' }, { iso: 'ug', name: 'Uighur' }, { iso: 'uk', name: 'Ukrainian' }, { iso: 'ur', name: 'Urdu' }, { iso: 'uz', name: 'Uzbek' }, { iso: 've', name: 'Venda' }, { iso: 'vi', name: 'Viêt Namese' }, { iso: 'vo', name: 'Volapük' }, { iso: 'wa', name: 'Walloon' }, { iso: 'wo', name: 'Wolof' }, { iso: 'xh', name: 'Xhosa' }, { iso: 'yi', name: 'Yiddish' }, { iso: 'yo', name: 'Yoruba' },
  { iso: 'za', name: 'Zhuang' }, { iso: 'zh', name: 'Chinese' }, { iso: 'zu', name: 'Zulu' }];

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
  public lang: string = this.getLang().name;


  types: string[] = ['Public', 'Friends', 'ParticularFriend']

  constructor(private hub: SignalRService,private notifServ: NotifsService, private eventService: EventGameService, private nbdAdapter: NgbDateNativeAdapter, private userServ: UserService, private fb: FormBuilder, private authServ: AuthenticationService) {
    this.start = this.nbdAdapter.fromModel(new Date(Date.now()));
    this.startDate = fb.control(this.start, [Validators.required]);
    this.endDate = fb.control(this.start, [Validators.required]);
    this.ctlName = fb.control('', [Validators.required]);
    this.ctlDesc = fb.control('', Validators.required);
    this.ctlType = fb.control(0, Validators.required);
    this.ctlNumber = fb.control(0, Validators.required);
    this.ctlLang = fb.control('', []);
    this.ctlGame = fb.control('', Validators.required);
    this.ctlTimepickerStart = fb.control({ hour: 13, minute: 30 }, []);
    this.ctlTimepickerEnd = fb.control({ hour: 14, minute: 30 }, []);
    this.filteredFriends = this.ctrlFriends.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filter(user) : this.allFriends.slice()));
    this.filteredGames = this.ctlGame.valueChanges.pipe(
      startWith(null),
      map((name: string | null) => name ? this._filterGame(name) : this.games.slice()));
  }
  getLang() {
    const userLang = navigator.language.slice(0, 2);
    let lang = this.langages.find(l => l.iso === userLang);
    return lang;
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
      accessType: this.ctlType,
      langue: this.ctlLang
    });
  }
  // crossValidations(group: FormGroup): ValidationErrors {
  //   if(group.value.eventType === 'ParticularFriend' && this.nFriends.length < group.value.nbUsers){
  //     return {nbUsersError: true};
  //   }
  // }
  addTontags(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const x = this.allFriends.find(user => user.pseudo.toLowerCase() == value.trim().toLowerCase());
    if ((value || '').trim() && x) {
      this.nFriends.push(x);
      this.allFriends = _.remove(this.allFriends, user => user.pseudo != value.trim());
    }
    else {
      this.ctrlFriends.setErrors({ invalidInput: true });
    }
    if (input) {
      input.value = '';
    }
    if (this.ctrlFriends.valid) {
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
    this.allFriends.splice(index, 1);
    this.friendsInput.nativeElement.value = '';
    this.ctrlFriends.setValue(null);
    console.log("test", this.allFriends);
  }

  private _filter(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.allFriends.filter(user => user.pseudo.toLowerCase().indexOf(filterValue) === 0);
  }
  private _filterGame(value: string): Game[] {
    const filterValue = value.toLowerCase();
    return this.games.filter(game => game.name.toLowerCase().startsWith(filterValue));
  }
  add() {
    const gametm = this.games.find(game => game.name === this.ctlGame.value);
    let startdate = this.nbdAdapter.toModel(this.frm.value.start_date);
    let enddate = this.nbdAdapter.toModel(this.frm.value.end_date);
    Object.assign(this.frm.value, { start_date: startdate, end_date: enddate, createdByUserId: this.authServ.currentUser.id });
    const ev = Object.assign({}, { ...this.frm.value }, { gameId: gametm.id });
    const eventData = new Event(ev);
    eventData.accessType = Number.parseInt(this.frm.value.accessType);
    console.log(eventData);
    this.eventService.createEvent(eventData).subscribe(res => {
      if (eventData.accessType === AccessType.ParticularFriend) {
        this.nFriends.forEach(user => {
          const notif = new Notif({ 
            see: false, 
            senderId: this.authServ.currentUser.id, 
            notificationType: NotificationTypes.EventInvitation, 
            eventId: res.id ,
            receiverId: user.id,
            createdOn: new Date(Date.now())
          })
          this.notifServ.sendNotification(notif, null).subscribe(res => {
            this.hub.addFriendNotif(user,notif);
          });
        });
      }
    });

  }

}