import { Component, ɵflushModuleScopingQueueAsMuchAsPossible } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { SourceListMap } from 'source-list-map';

/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'postlist-component',
  templateUrl: './postlist.component.html',
})
export class PostListComponent {
  panelOpenState = false;
  posts = [];
  constructor(private postService: PostService) { }
  ngOnInit() {
    this.postService.getAll().subscribe(posts => {
      this.posts = posts;
    })
  }
  newest() {

  }
  unanswered(){

  }
  votes() {

  }
  withTags(){
    
  }
  
}