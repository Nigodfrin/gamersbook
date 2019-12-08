import { Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray, ValidatorFn, Validators } from "@angular/forms";
import { Tag } from "src/app/models/Tag";
import { TagService } from "src/app/services/tag.service";
import { PostService } from "src/app/services/post.service";
import { InjectSetupWrapper } from "@angular/core/testing";
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
    
    constructor( private fb: FormBuilder,private tagService: TagService, private postService: PostService){
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
    submit() {
        const selectedOrderIds = this.frm.value.tags
          .map((v, i) => v ? this.tags[i].id : null)
          .filter(v => v !== null);
        console.log(selectedOrderIds);
      }
      add(){
        this.postService.addQuestion(this.ctlTitle.value, this.ctlBody.value).subscribe();             
      }


}