import { Component, EventEmitter, Output } from '@angular/core';

/** @title Datepicker touch UI */
@Component({
  selector: 'datepicker-touch-example',
  templateUrl: 'datepicker-touch-example.html',
})
export class DatepickerTouchExample {
  @Output() newItemEvent = new EventEmitter<any>();
  selectedDate: string = "";
  
  cancel(){
    console.log("cancel")
    let date = new Date('October 13, 1996 05:35:32'); 
    console.log(typeof(date))
    this.newItemEvent.emit(date);
  }
}

