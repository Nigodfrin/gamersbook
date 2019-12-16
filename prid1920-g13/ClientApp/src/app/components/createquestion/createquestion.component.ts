import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray, ValidatorFn, Validators } from "@angular/forms";
import { Tag } from "src/app/models/Tag";
import { TagService } from "src/app/services/tag.service";
import { PostService } from "src/app/services/post.service";
import { Post } from "src/app/models/Post";
import { ActivatedRoute, Router } from "@angular/router";
import { User } from "src/app/models/User";
import { post } from "selenium-webdriver/http";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
  templateUrl: './createquestion.component.html',
})
export class CreateQuestionComponent implements OnInit {

  public frm: FormGroup;
  public ctlBody: FormControl;
  public ctlTitle: FormControl;
  public tags: Tag[];
  public question: Post;
  public isNew: boolean;
  public tmpBody: string;
  public tmpTitle: string;

  constructor(private fb: FormBuilder,
    private tagService: TagService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) { }
  ngOnInit() {
    if (!this.authenticationService.currentUser) {
      this.router.navigate(['/']);
  }
    let id = this.route.snapshot.paramMap.get('id');
    this.isNew = false;
    if (id != null) {
      this.postService.getById(id).subscribe(post => {
      this.question = post,
        this.ctlBody = this.fb.control(post.body, [Validators.required]);
        this.ctlTitle = this.fb.control(post.title, [Validators.required]);;
        this.tmpBody = post.body;
        this.tmpTitle = post.title;
        this.frm = this.fb.group({
          body: this.ctlBody,
          title: this.ctlTitle,
          tagsForm: new FormArray([])
        }, {});
        this.tagService.getAll().subscribe(tags => {
          this.tags = tags;
          this.addTags();
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
        tagsForm: new FormArray([])
      }, {});
      this.tagService.getAll().subscribe(tags => {
        this.tags = tags;
        this.addTags();
      });
    }
  }
  addTags() {
    this.tags.forEach((o, i) => { this.tags.forEach
      const control = new FormControl();
      if(this.question){
        control.setValue(this.question.tags.find(p => p.id == o.id) ? true : false);
        
      }
      (this.frm.controls.tagsForm as FormArray).push(control);
    });
  }
  submit(): any {
    const selectedOrderIds = this.frm.value.tagsForm
      .map((v, i) => v ? this.tags[i] : null)
      .filter(v => v !== null);
    return selectedOrderIds;
  }
  add() {
    this.postService.addQuestion(this.ctlTitle.value, this.ctlBody.value,this.submit()).subscribe( res => {
      this.router.navigate(['/postlist']);
    });      
  }
  update() {
    var id =+this.route.snapshot.paramMap.get('id');
    var post: Post = new Post({id: id,body: this.ctlBody.value , title: this.ctlTitle.value,tags: this.submit() });
    this.postService.update( post ).subscribe(res => {
      this.router.navigate(['/postlist']);
    });
  }
  cancel(){
    if(this.isNew){
      this.ctlBody.setValue('');
      this.ctlTitle.setValue('');
    }
    else{
      this.ctlTitle.setValue(this.tmpTitle);
      this.ctlBody.setValue(this.tmpBody);
    }
    // if(this.frm.valid)
    // this.frm.reset();
  }


}