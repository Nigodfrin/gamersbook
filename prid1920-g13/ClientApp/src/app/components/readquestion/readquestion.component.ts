import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './readquestion.component.html',
})
export class ReadQuestion {
    id : any;
    constructor(private route: ActivatedRoute){
        this.id =route.snapshot.queryParamMap.get('id');
        console.log(this.id);
    }
    
}