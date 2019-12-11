import { Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray, ValidatorFn, Validators } from "@angular/forms";
import { Tag } from "src/app/models/Tag";
import { TagService } from "src/app/services/tag.service";
import { PostService } from "src/app/services/post.service";
import { PostTagService } from "src/app/services/posttag.service";
import { Post } from "src/app/models/Post";
import { User } from "src/app/models/User";

@Component({
    templateUrl: './createquestion.component.html',
  })
export class CreateQuestionComponent {
  
    public frm: FormGroup;
    public ctlBody: FormControl;
    public ctlTitle: FormControl;
    public tags: Tag[];
    public post: Post;
    
    constructor( private fb: FormBuilder,private tagService: TagService, private postService: PostService, private postTagService: PostTagService){
        this.ctlBody = this.fb.control('',[Validators.required]);
        this.ctlTitle = this.fb.control('',[Validators.required]);
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
    addTags() {
        this.tags.forEach((o, i) => {
            const control = new FormControl();
            (this.frm.controls.tagsForm as FormArray).push(control);
          });
    }
    submit(): any {
        const selectedOrderIds = this.frm.value.tagsForm
          .map((v, i) => v ? this.tags[i].id : null)
          .filter(v => v !== null);
        return selectedOrderIds;
      }
      add(){
         this.postService.addQuestion(this.ctlTitle.value, this.ctlBody.value).subscribe();  
        // this.postService.getLast().subscribe(post => {
        //  this.post = post;
        //})       
        this.postTagService.addPostTag(this.submit());
      }


}