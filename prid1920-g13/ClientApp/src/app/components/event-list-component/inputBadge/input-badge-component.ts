import { Component, ViewChild, ElementRef, OnInit, Input, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';
import * as _ from 'lodash'; 
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { COMMA } from '@angular/cdk/keycodes';

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
  badgeTab: any[] = [];
  filteredData: Observable<any[]>;
  filter: FormControl = new FormControl('',[]);
  @Input() tableData: any[] = [];
  @ViewChild('InputData', { static: false }) Input: ElementRef<HTMLInputElement>;
  @ViewChild('datas', { static: false }) matAutocomplete: MatAutocomplete;
  
  constructor(){  
    this.filteredData = this.filter.valueChanges.pipe(
      startWith(null),
      map((user: string | null) => user ? this._filter(user) : this.tableData.slice()));
  }
  
  ngOnInit(){
    

  }
  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.tableData.filter(user => user.name.toLowerCase().indexOf(filterValue) === 0);
  }
  addTontags(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const x = this.tableData.find(user => user.name.toLowerCase() == value.trim().toLowerCase());
    if((value || '').trim() && x) {
      this.badgeTab.push(x);
      this.tableData = _.remove(this.tableData,user => user.pseudo != value.trim());
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
  const data = this.tableData.find(data => data.name.toLowerCase() == event.option.viewValue.toLowerCase());
  const index = this.tableData.indexOf(data);
  this.badgeTab.push(data);
  this.tableData.splice(index,1);
  this.Input.nativeElement.value = '';
}

}
