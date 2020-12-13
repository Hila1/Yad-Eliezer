import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'chips-component',
  styleUrls: ['chips.css'],
  templateUrl: 'chips.component.html',
})
export class ChipsComponent {
  visible = true;
  selectable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  @Input() allStuff: {};
  @Output() newItemEvent = new EventEmitter<string>();

  fruits: any[] = [];
  allFruits: any[];
  

  // @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  // @ViewChild('auto') matAutocomplete: MatAutocomplete;

  // constructor() {
  //   this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
  //     startWith(null),
  //     map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  // }

  ngOnInit() {
    this.allFruits = [];
    for (let key in this.allStuff) {
      this.allFruits.push(this.allStuff[key]['name']);
    }
    this.fruits = Object.assign(this.allFruits);
  }

  getChipStyle(stuffName){
    for (let key in this.allStuff) {
      if(this.allStuff[key]['name'] === stuffName){
       return { 
         backgroundColor: this.allStuff[key]['color']['primary'],
         color: "#FFFFFF"
       };
      }
    }
    return {};
  }
  getIcon(fruit){
    if(this.fruits.includes(fruit.trim())) {
      return 'cancel'
    }
    return 'add_circle'
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
    this.newItemEvent.emit(value);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if ((value || '').trim()) {
      // make sure the selected stuff is not in the selected array
      if(!this.fruits.includes(value.trim())) {
        this.fruits.push(value.trim());
      }
    }
    // this.fruits.push(event.option.viewValue);
    // this.fruitInput.nativeElement.value = '';
    // this.fruitCtrl.setValue(null);
  } 

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }
}