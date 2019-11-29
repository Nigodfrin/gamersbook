import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostService } from 'src/app/services/post.service';

@Component({
  templateUrl: './readquestion.component.html',
})
export class ReadQuestion {
  question: any;
  constructor(private route: ActivatedRoute, private service: PostService) {
    let id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.service.getById(id).subscribe(post => {
      this.question = post;
      console.log(this.question);
    });
  }

  ngOnInit() {
    
    ;
  }

}