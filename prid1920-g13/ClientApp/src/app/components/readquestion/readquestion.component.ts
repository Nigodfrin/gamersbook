import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PostService } from 'src/app/services/post.service';


@Component({
  templateUrl: './readquestion.component.html',
})
export class ReadQuestion implements OnInit {
  question: any;
  constructor(private route: ActivatedRoute, private service: PostService) {
    
  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.service.getById(id).subscribe(post => {
      this.question = post;
      console.log(this.question);
    });
    ;
  }

}