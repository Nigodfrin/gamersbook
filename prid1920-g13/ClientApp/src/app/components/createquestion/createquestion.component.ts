import { Component } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, FormArray } from "@angular/forms";
import { TagService } from "src/app/services/tag.service";
import { Tag } from "src/app/models/Tag";

@Component({
    templateUrl: './createquestion.component.html',
  })
export class CreateQuestionComponent {
    public frm: FormGroup;
    public ctlBody: FormControl;
    public ctlTitle: FormControl;
    public tags: Tag[];
    
    constructor(private fb: FormBuilder,private tagService: TagService){
        this.ctlBody = this.fb.control('');
        this.ctlTitle = this.fb.control('');
        this.frm = this.fb.group({
            body: this.ctlBody,
            title: this.ctlTitle,
            tagsForm: new FormArray([])
        }, {});
        this.tagService.getAllTags().subscribe(tags => {
            this.tags = tags;
            this.addTags();
        });
    }
    addTags() {
        this.tags.forEach((o, i) => {
            const control = new FormControl(i === 0);
            (this.frm.controls.tagsForm as FormArray).push(control);
          });
    }
    submit() {
        const selectedOrderIds = this.frm.value.tags
          .map((v, i) => v ? this.tags[i].id : null)
          .filter(v => v !== null);
        console.log(selectedOrderIds);
      }

}