import { CalendarService } from '../services/calendar.service';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef } from '@angular/core';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { colors, EventColor } from '../demo-utils/colors';
import { formatNumber } from '@angular/common';

@Component({
    selector: 'mwl-demo-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['calendar.css'],
    templateUrl: 'calendar.component.html',
})
export class CalendarComponent {
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

    locale: string = "he";

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    colorsArray = Object.keys( colors );
    currentColorIndex = 0;

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            a11yLabel: 'Edit',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            },
        },
        {
            label: '<i class="fas fa-fw fa-trash-alt"></i>',
            a11yLabel: 'Delete',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter((iEvent) => iEvent !== event);
                this.handleEvent('Deleted', event);
            },
        },
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[];
    activeDayIsOpen: boolean = true;
    StuffColors: {} = {};

    constructor(private _calendarService: CalendarService,
        private modal: NgbModal) { };

    ngOnInit() {
        this._calendarService.getAllEvents().subscribe(events => {
            console.log(events);
            this.events = [];
            events.forEach((event: {}) => {
                this.events.push(this.fixEventFormat(event));


            });
        })
    }
    fixEventFormat(event: {}): CalendarEvent<any> {
        // var stuffId = event['BridalStaffId'];
        // var color = this.getStuffIdToColors(stuffId);
        // var newColor = this.getNewColor()
        // console.log(color)
        // console.log(newColor)



        let formatedEvent: CalendarEvent<any> = {
            start: new Date(event['start']),
            end: new Date(event['end']),
            title: "this is the title",
            color: this.getStuffIdToColors(event['BridalStaffId'])
        }
        return formatedEvent;

    }

    // this function gets a stuff ID and returns its event color
    getStuffIdToColors(stuffId: string): EventColor {
        var res = this.StuffColors[stuffId];
        if(res == undefined){
        // if (stuffId in this.StuffColors) {
        //     res = 
        // } else {
            this.StuffColors[stuffId] = this.getNewColor();
            res = this.StuffColors[stuffId]
        }

        return res;
    }

    getNewColor(): EventColor {
        let res = colors[this.colorsArray[this.currentColorIndex]];
        this.currentColorIndex +=1;
        return res;
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd,
    }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map((iEvent) => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        this.modal.open(this.modalContent, { size: 'lg' });
    }

    addEvent(): void {
        this.events = [
            ...this.events,
            {
                title: 'New event',
                start: startOfDay(new Date()),
                end: endOfDay(new Date()),
                color: colors.red,
                draggable: true,
                resizable: {
                    beforeStart: true,
                    afterEnd: true,
                },
            },
        ];
    }

    deleteEvent(eventToDelete: CalendarEvent) {
        this.events = this.events.filter((event) => event !== eventToDelete);
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }
}
