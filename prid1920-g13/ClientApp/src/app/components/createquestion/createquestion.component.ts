import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, AfterViewInit, AfterViewChecked } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray, ValidatorFn, Validators, ValidationErrors } from "@angular/forms";
import { Tag } from "src/app/models/Tag";
import { TagService } from "src/app/services/tag.service";
import { PostService } from "src/app/services/post.service";
import { Post } from "src/app/models/Post";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "src/app/models/User";
import { post } from "selenium-webdriver/http";
import { AuthenticationService } from "src/app/services/authentication.service";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from "rxjs";
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from "@angular/material";
import { startWith, map } from "rxjs/operators";
import * as _ from 'lodash';

@Component({
  templateUrl: './createquestion.component.html',
  styleUrls: ['./createquestion.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateQuestionComponent implements OnInit, AfterViewChecked {

  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tags', { static: false }) matAutocomplete: MatAutocomplete;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [COMMA];
  tagsCtrl = new FormControl();
  filteredTags: Observable<Tag[]>;
  ntags: Tag[] = [];
  allTags: Tag[] = [];

  public frm: FormGroup;
  public ctlBody: FormControl;
  public ctlTitle: FormControl;
  public question: Post;
  public isNew: boolean;
  public tmpBody: string;
  public tmpTitle: string;

  constructor(private fb: FormBuilder,
    private tagService: TagService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.filteredTags = this.tagsCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => tag ? this._filter(tag) : this.allTags.slice()));
  }
  addTontags(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const x = this.allTags.find(tag => tag.name == value.trim());
    if ((value || '').trim() && x) {
      this.ntags.push(this.allTags.find(tag => tag.name == value.trim()));
      this.allTags = _.remove(this.allTags, tag => tag.name != value.trim());
    }
    else {
      this.tagsCtrl.setErrors({ invalidInput: true });
    }
    if (input) {
      input.value = '';
    }
    if (this.tagsCtrl.valid) {
      this.tagsCtrl.setValue(null);
    }
  }

  remove(tag: Tag): void {
    const index = this.ntags.indexOf(tag);
    if (index >= 0) {
      this.ntags.splice(index, 1);
      this.allTags.push(new Tag(tag));
      this.tagsCtrl.markAsDirty();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.ntags.push(this.allTags.find(tag => tag.name == event.option.viewValue));
    this.allTags = _.remove(this.allTags, tag => tag.name != event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  private _filter(value: string): Tag[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.name.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.isNew = false;
    if (id != null) {
      this.postService.getById(id).subscribe(post => {
        this.question = post;
        this.ntags = post.tags;
        this.ctlBody = this.fb.control(post.body, [Validators.required]);
        this.ctlTitle = this.fb.control(post.title, [Validators.required]);;
        this.tmpBody = post.body;
        this.tmpTitle = post.title;
        this.frm = this.fb.group({
          body: this.ctlBody,
          title: this.ctlTitle,
          tags: this.tagsCtrl
        }, {});
        this.tagService.getAll().subscribe(tags => {
          this.ntags.forEach(tag => {
            tags = _.remove(tags, t => tag.name != t.name);
          });
          this.allTags = tags;
        });
      });
    }
    else {
      this.isNew = true;
      this.ctlBody = this.fb.control('', [Validators.required]);
      this.ctlTitle = this.fb.control('', [Validators.required]);
      this.frm = this.fb.group({
        body: this.ctlBody,
        title: this.ctlTitle,
        tags: this.tagsCtrl
      });
      this.tagService.getAll().subscribe(tags => {
        this.allTags = tags;
      });
    }
  }
  ngAfterViewChecked() {
    this.changeLinkTitle();

  }
  add() {
    this.postService.addQuestion(this.ctlTitle.value, this.ctlBody.value, this.ntags).subscribe(res => {
      this.router.navigate(['/postlist']);
    });
  }
  update() {
    var id = this.route.snapshot.paramMap.get('id');
    var post: Post = new Post({ id: id, body: this.ctlBody.value, title: this.ctlTitle.value, tags: this.ntags });
    this.postService.update(post).subscribe(res => {
      this.router.navigate(['/postlist']);
    });
  }
  changeLinkTitle() {
    try {
      
    } catch (error) {
      
    }
    document.getElementsByClassName("smdi-bold")[0].setAttribute("title", "bold (Ctrl+B)")
    document.getElementsByClassName("smdi-italic")[0].setAttribute("title", "italic (Ctrl+I)")
    document.getElementsByClassName("smdi-header")[0].setAttribute("title", "header (Ctrl+H)")
    document.getElementsByClassName("smdi-quote-left")[0].setAttribute("title", "quote-left (Ctrl+')")
    // document.getElementsByClassName("smdi-strikethrough")[0].setAttribute("title", "strikethrough")
    // document.getElementsByClassName("smdi-code")[0].setAttribute("title", "code (Ctrl+Alt+C)")
    document.getElementsByClassName("smdi-list-ul")[0].setAttribute("title", "list (Ctrl+L)")
    document.getElementsByClassName("smdi-list-ol")[0].setAttribute("title", "list (Ctrl+Alt+L)")
    // document.getElementsByClassName("smdi-eraser")[0].setAttribute("title", "eraser (Ctrl+E)")
    document.getElementsByClassName("smdi-link")[0].setAttribute("title", "link (Ctrl+K)")
    document.getElementsByClassName("smdi-image")[0].setAttribute("title", "image (Ctrl+Alt+I)")
    // document.getElementsByClassName("smdi-table")[0].setAttribute("title", "table")
    // document.getElementsByClassName("smdi-line")[0].setAttribute("title", "line")
    document.getElementsByClassName("smdi-eye")[0].setAttribute("title", "see (Ctrl+P)")
    // document.getElementsByClassName("smdi-columns")[0].setAttribute("title", "columns (F9)")
    // document.getElementsByClassName("smdi-fullscreen")[0].setAttribute("title", "fullscreen (F11)")
    // document.getElementsByClassName("smdi-question")[0].setAttribute("title", "question")
    document.getElementsByClassName("smdi-undo")[0].setAttribute("title", "undo (Ctrl+Z)")
    document.getElementsByClassName("smdi-redo")[0].setAttribute("title", "redo (Ctrl+Y)")
  }
}