import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, Input } from "@angular/core";
import { NguCarouselConfig } from "@ngu/carousel";
import { Game } from "src/app/models/Game";

@Component({
  selector: 'carousel-profile-component',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  // styleUrls: ['./profile.component.css']
})
export class CarouselComponent {
  @Input('games') games: Game[];
  imgags = [
    '../../assets/tuto_prid1.jpg',
    '../../assets/tuto_prid1.jpg',
    '../../assets/tuto_prid1.jpg',
    '../../assets/tuto_prid1.jpg'
  ];
  public carouselTileItems: Array<any> = [0, 1, 2, 3, 4, 5];
  public carouselTiles = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: []
  };
  public carouselTile: NguCarouselConfig = {
    grid: { xs: 2, sm: 2, md: 3, lg: 4, all: 0 },
    slide: 3,
    speed: 1000,
    point: {
      visible: true
    },
    loop: true,
    load: 2,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };
  constructor(private _cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this._cdr.detectChanges();
  }

  ngOnInit() {
    this.carouselTileItems.forEach(el => {
      this.carouselTileLoad(el);
    });
    console.log(this.games);
  }

  public carouselTileLoad(j) {
    const len = this.carouselTiles[j].length;
    if (len <= 30) {
      for (let i = len; i < len + 15; i++) {
        this.carouselTiles[j].push(
          this.imgags[Math.floor(Math.random() * this.imgags.length)]
        );
      }
    }
  }
}
