import { CalendarService } from '../services/calendar.service';
import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, EventEmitter, Output } from '@angular/core';
import {
    startOfDay,
    endOfDay,
    isSameDay,
    isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDateFormatter, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView } from 'angular-calendar';
import { colors, EventColor, metaTypes } from '../demo-utils/colors';
import { DatePipe } from '@angular/common';
import { CustomDateFormatter } from './custom-date-formatter.provider';
import { NativeDateAdapter, DateAdapter} from '@angular/material/core';

interface EventGroupMeta {
    type: string;
}

@Component({
    selector: 'mwl-demo-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['calendar.css'],
    templateUrl: 'calendar.component.html',
    providers: [
        {
            provide: CalendarDateFormatter,
            useClass: CustomDateFormatter,
        },
    ]
})
export class CalendarComponent {
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();

    locale: string = "he";

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    dayStartHour = 7;
    dayEndHour = 22;

    colorsArray = Object.keys(colors);
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
    allEvents: CalendarEvent[];

    activeDayIsOpen: boolean = false;
    stuffColors: {} = null;
    jewishDates = null;
    datesObject: {};
    groupedSimilarEvents: CalendarEvent[] = [];
    value = ""

    constructor(private _calendarService: CalendarService,
        private modal: NgbModal,
        public datepipe: DatePipe,
        private dateAdapter: DateAdapter<NativeDateAdapter>,
        ) { };

    ngOnInit() {
        this.dateAdapter.setLocale('he-HE');

        this._calendarService.getAllEvents().subscribe(events => {
            this.events = [];
            this.allEvents = [];
            events.forEach((event: {}) => {
                let formatedEvent = this.fixEventFormat(event)
                this.events.push(formatedEvent);
                this.allEvents.push(formatedEvent);
            });
            // get jewish dates
            this._calendarService.getJewishFullYearDates().subscribe(data => {
                this.jewishDates = data['items'];
                // console.log(this.jewishDates);
                this.createDatesObject();
            })
            this.groupSimilarEvents();
        })
    }

    groupSimilarEvents() {
        // group any events together that have the same type and dates
        // use for when you have a lot of events on the week or day view at the same time
        this.groupedSimilarEvents = [];
        const processedEvents = new Set();
        this.events.forEach((event) => {
            if (processedEvents.has(event)) {
                return;
            }
            const similarEvents = this.events.filter((otherEvent) => {
                return (
                    otherEvent !== event &&
                    !processedEvents.has(otherEvent) &&
                    isSameDay(otherEvent.start, event.start) &&
                    (isSameDay(otherEvent.end, event.end) ||
                        (!otherEvent.end && !event.end)) &&
                    otherEvent.color.primary === event.color.primary &&
                    otherEvent.color.secondary === event.color.secondary
                );
            });
            processedEvents.add(event);
            similarEvents.forEach((otherEvent) => {
                processedEvents.add(otherEvent);
            });
            if (similarEvents.length > 0) {
                this.groupedSimilarEvents.push({
                    title: `${similarEvents.length + 1} events`,
                    color: event.color,
                    start: event.start,
                    end: event.end,
                    meta: {
                        groupedEvents: [event, ...similarEvents],
                    },
                });
            } else {
                this.groupedSimilarEvents.push(event);
            }
        });
    }

    beforeMonthViewRender({
        body,
    }: {
        body: CalendarMonthViewDay<EventGroupMeta>[];
    }): void {
        // month view has a different UX from the week and day view so we only really need to group by the type
        body.forEach((cell) => {
            const groups = {};
            cell.events.forEach((event: CalendarEvent<EventGroupMeta>) => {
                groups[event.meta.type] = groups[event.meta.type] || [];
                groups[event.meta.type].push(event);
            });
            cell['eventGroups'] = Object.entries(groups);
        });
    }

    createDatesObject() {
        this.datesObject = {}
        this.jewishDates.forEach(element => {
            this.datesObject[element['date']] = element['hebrew']
        });
        // refresh the calendar view, so the events will display
        this.refresh.next();
    }

    /**
     * @param event an event from the server
     * this function reformmat the event and returns it
     */
    fixEventFormat(event: {}): CalendarEvent<any> {
        let formatedEvent: CalendarEvent<any> = {
            start: new Date(event['start']),
            end: new Date(event['end']),
            title: event['title'] + " " + event['start'].slice(11, 16),
            color: this.getStuffIdMeta(event)['color'],
            meta: { type: this.getStuffIdMeta(event)['meta'] }
        }
        return formatedEvent;
    }

    /**
     * 
     * @param eventItem an id of the stuff 
     *  this function returns the event color that matches the given stuff id.
     */
    getStuffIdMeta(eventItem): {} {
        if (this.stuffColors == null) { this.stuffColors = {}; } // init the obj if needed
        var res = this.stuffColors[eventItem['BridalStaffId']];
        if (res == undefined || null) {
            this.stuffColors[eventItem['BridalStaffId']] = {
                color: this.getNewColor(),
                meta: this.getMeta(),
                name: eventItem['BridalStaff']
            }
            this.currentColorIndex += 1;
            if (this.currentColorIndex >= metaTypes.length) { this.currentColorIndex = 0; }
            res = this.stuffColors[eventItem['BridalStaffId']]
        }
        return res;
    }


    /**
     *  This function returning the correct meta for the current color.
     */
    getMeta(): string {
        let res = this.colorsArray[this.currentColorIndex];
        return res;
    }

    /**
     *  This function returning new (unused) color from the colors obj.
     */
    getNewColor(): EventColor {
        let res = colors[this.colorsArray[this.currentColorIndex]];
        return res;
    }

    filterCalendarEventsByStuff(arrayOfStuff) {
        let temporaryArray = [];
        // go through all the events
        for (let event of this.allEvents) {
            // check all the stuff
            for (let stuff of arrayOfStuff) {
                // if the stuff is belong to the event
                if (event['title'].indexOf(stuff['name']) > -1) {
                    // check if the stuff should be visible or not
                    if (stuff['isSelected']) {
                        temporaryArray.push(event);
                        break;
                    }
                    
                }
            }
        }
        this.events = temporaryArray;
    }

    changeDay(date: Date) {
        this.viewDate = date;
        // this.view = CalendarView.Day;
    }

    goToDate(date) {
        let newDate = new Date(date);
        if (!this.isValidDate(newDate)) {
            //try jewish date
            return;
        }
        this.changeDay(newDate);
    }

    isValidDate(d) {
        return d instanceof Date && !isNaN(d.getTime());
    }

    /**
     * @param date the date of the current day in the month view
     *  This function gets a date and returns its jewish date.
     */
    getJewishDate(date) {
        var dateObj = new Date(date); // make an date object
        let position = this.datepipe.transform(dateObj, 'yyyy-MM-dd'); // get the needed format of the date
        var res = this.datesObject[position]; // use the date to get the hebrew date form the object

        if (!res) {
            return ""
        }
        // remove the year from the date format 
        if (res.indexOf("תש") !== -1) {
            res = res.slice(0, res.indexOf("תש") - 1)
        }
        return res;
    }

    // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    //     events = events.sort((a, b) => (a.start < b.start) ? -1 : 1)
    //     if (isSameMonth(date, this.viewDate)) {
    //         if (
    //             (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
    //             events.length === 0
    //         ) {
    //             this.activeDayIsOpen = false;
    //         } else {
    //             this.activeDayIsOpen = true;
    //         }
    //         this.viewDate = date;
    //     }
    // }

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
