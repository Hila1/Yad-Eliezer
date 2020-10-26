import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MbscEventcalendarOptions } from '@mobiscroll/angular';


@Component({
    selector: 'calendar',
    styleUrls: ['calendar.css'],
    templateUrl: 'calendar.component.html',
})
export class CalendarComponent implements OnInit {

    constructor(private http: HttpClient) {}

    events: any;

    eventSettings: MbscEventcalendarOptions = {
        lang: 'he',
        theme: 'material',
        themeVariant: 'light',
        display: 'inline',
        view: {
            calendar: { type: 'month' },
            eventList: { type: 'month', scrollable: true }
        }
    };

    ngOnInit() {
        this.http.jsonp('https://trial.mobiscroll.com/events/', 'callback').subscribe((resp: any) => {
            this.events = resp;
        });
    }
}