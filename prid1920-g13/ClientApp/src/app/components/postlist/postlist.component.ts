import { Component, ɵflushModuleScopingQueueAsMuchAsPossible,OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { SourceListMap } from 'source-list-map';
import { Post } from 'src/app/models/Post';

/**
 * @title Basic expansion panel
 */
@Component({
  selector: 'postlist-component',
  templateUrl: './postlist.component.html',
})

export class PostListComponent implements OnInit {
  panelOpenState = false;
  posts:any;

  constructor(private postService: PostService) { }
  ngOnInit() {
    this.postService.getAll().subscribe(posts => {
      this.posts = posts;
    })
  }
  newest() {
      this.postService.getNewest().subscribe(posts => {
        this.posts = posts;
      })
  }
  unanswered(){
    this.postService.getNonAnswered().subscribe(posts => {
      this.posts = posts;
    })
  }
  // votes() {
  //   this.postService.getOrderByVotes().subscribe(posts => {
  //     this.posts = posts;
  //   })
  // }
  withTags(){
    this.postService.getWithTags().subscribe(posts => {
      this.posts = posts;
    })
  }
}