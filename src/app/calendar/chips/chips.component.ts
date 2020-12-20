import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { Subject } from 'rxjs';

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
  refresh: Subject<any> = new Subject();

  @Input() allStuff: {};
  @Output() newItemEvent = new EventEmitter<any>();

  fruits: any[] = [];
  allFruits: any[];
  constructor(private _globalFunctionService: GlobalFunctionsService) { }

  ngOnInit() {
    this.allFruits = [];
    for (let key in this.allStuff) {
      this.allFruits.push(this.getFormattedItem(key));
    }
    this.fruits = Object.assign(this.allFruits);

    // get list of rooms from the service
    this._globalFunctionService.getTableData("Room", "Description").subscribe(data => {
      for (let item of data[0]) {
        this.allFruits.push({
          name: item['Description'],
          style: {backgroundColor: "#1a9177", color: "#FFFFFF"},
          icon: "cancel",
          isSelected: true,
          color: {primary: "#1a9177", secondary: "#57c2a6"},
        });
      }
      this.fruits = Object.assign(this.allFruits);
      console.log(this.fruits);
      this.refresh.next();

      this.fruits.slice();
    });
  }
  getFormattedItem(key: string): any {
    return{
      name: this.allStuff[key]['name'],
      style: this.getChipStyle(this.allStuff[key]),
      icon: "cancel",
      isSelected: true,
      color: this.allStuff[key]['color'],
    }  }

  getChipStyle(fruit, isSelected = true) {
    return {
      backgroundColor: isSelected ?
        fruit['color']['primary'] :
        fruit['color']['secondary'],
      color: "#FFFFFF"
    }
  }

  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our fruit
  //   if ((value || '').trim()) {
  //     this.fruits.push(value.trim());
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }

  //   this.fruitCtrl.setValue(null);
  //   this.newItemEvent.emit(value);
  // }

  remove(fruit: {}): void {
    fruit['isSelected'] = !fruit['isSelected'];
    fruit['icon'] = fruit['isSelected'] ? 'cancel' : 'add_circle';
    fruit['style'] = this.getChipStyle(fruit, fruit['isSelected']);

    this.newItemEvent.emit(this.fruits);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.viewValue;
    if ((value || '').trim()) {
      // make sure the selected stuff is not in the selected array
      if (!this.fruits.includes(value.trim())) {
        this.fruits.push(value.trim());
      }
    }
    // this.fruits.push(event.option.viewValue);
    // this.fruitInput.nativeElement.value = '';
    // this.fruitCtrl.setValue(null);
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  // }
}