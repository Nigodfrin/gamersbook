import { Component, ViewChild, ElementRef, OnInit, Input, AfterViewInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Game } from 'src/app/models/Game';

@Component({
  selector: 'input-badge',
  templateUrl: './input-badge-component.html',
  styleUrls: ['./input-badge-component.css'],
  encapsulation: ViewEncapsulation.None

})
export class InputBadgeComponent implements OnInit {

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [COMMA];
  badgeTab: Game[] = [];
  filteredData: Observable<Game[]>;
  filter: FormControl = new FormControl('', []);
  @Input() tableData: Game[] = [];
  @Output() filterEvents = new EventEmitter<Game[]>();
  @ViewChild('InputData', { static: false }) Input: ElementRef<HTMLInputElement>;
  @ViewChild('datas', { static: false }) matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredData = this.filter.valueChanges.pipe(
      startWith(null),
      map((game: string | null) => game ? this._filter(game) : this.tableData.slice()));
  }

  ngOnInit() {


  }
  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.tableData.filter(game => game.name.toLowerCase().indexOf(filterValue) === 0);
  }
  addTontags(event: MatChipInputEvent): void {
    const input = event.input;
    const value = parseInt(event.value);
    const x = this.tableData.find(game => game.id == value);
    if ((value || '') && x) {
      this.badgeTab.push(x);
      this.tableData = _.remove(this.tableData, game => game.id != value);
      this.filterEvents.emit(this.badgeTab);
    }
    if (input) {
      input.value = '';
    }

  }

  remove(data: any): void {
    const index = this.badgeTab.indexOf(data);
    if (index >= 0) {
      this.badgeTab.splice(index, 1);
      this.tableData.push(data);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const data = this.tableData.find(data => data.id == parseInt(event.option.viewValue));
    const index = this.tableData.indexOf(data);
    this.badgeTab.push(data);
    this.tableData.splice(index, 1);
    this.Input.nativeElement.value = '';
    this.filterEvents.emit(this.badgeTab);
  }
}
