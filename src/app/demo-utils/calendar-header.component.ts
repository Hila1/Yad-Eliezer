// This class is used for the calenar component as its headers
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "mwl-demo-utils-calendar-header",
  styleUrls: ['calendar-header.css'],
  template: `
  <div mwlCalendarToday class='date'
    [(viewDate)]="viewDate"
    (viewDateChange)="viewDateChange.next(viewDate)">
    {{ viewDate | calendarDate: view + "ViewTitle":locale }}
  </div>
  <div class="line-container">
  <div class="row text-center" style="width:100%;">
      
      <div class="col-md-4">

        <div
          class="btn btn-primary"
          mwlCalendarPreviousView
          [view]="view"
          [(viewDate)]="viewDate"
          (viewDateChange)="viewDateChange.next(viewDate)">
          →
        </div>

        <div class="btn-group">
          <div
            class="btn btn-primary"
            (click)="viewChange.emit('month')"
            [class.active]="view === 'month'">
            חודש
          </div>
          <div
            class="btn btn-primary"
            (click)="viewChange.emit('week')"
            [class.active]="view === 'week'">
            שבוע
          </div>

          <div
            class="btn btn-primary"
            (click)="viewChange.emit('day')"
            [class.active]="view === 'day'">
            יום
          </div>

          <div
            class="btn btn-primary"
            mwlCalendarNextView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)">
            ←
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class CalendarHeaderComponent {
  @Input() view: string;

  @Input() viewDate: Date;

  @Input() locale: string = "he";

  @Output() viewChange: EventEmitter<string> = new EventEmitter();

  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  buttonsNames = ['day', 'week', 'month']
}
