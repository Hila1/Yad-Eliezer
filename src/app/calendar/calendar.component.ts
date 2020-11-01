import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MbscEventcalendar, MbscEventcalendarOptions, MbscPopupOptions, MbscRangeOptions, mobiscroll } from '@mobiscroll/angular';
import { CalendarService } from '../services/calendar.service';

/**
 * important comment!
 * in case of updating the library mobiscroll, go to the file 'mobiscroll.angular.min.js' (inside esm5),
 * look for the string: fromCharCode, bellow the for loop, add this line:
 *     b=b.replace("\\u0054\\u0052\\u0049\\u0041\\u004c","")
 */

mobiscroll.settings = {
    lang: 'he',
    theme: 'material',
    themeVariant: 'light'
};

let preventSet = false;
let id = 5;

const now = new Date();

@Component({
    selector: 'calendar',
    styleUrls: ['calendar.css'],
    templateUrl: 'calendar.component.html',
})
export class CalendarComponent implements OnInit {
    @ViewChild('mbscMonthCal')
    monthCal: MbscEventcalendar;

    @ViewChild('mbscDayCal')
    dayCal: MbscEventcalendar;

    allDay = false;
    eventDate = [now, new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2)];
    colorArray = ['#ffbdbd', '#b9ffb9', '#ffffd1', '#fffabd', '#bdfffc', '#bdc8ff', '#008016']

    isFree = 'busy';
    eventText = '';
    eventDesc = '';
    control: Array<string>;
    wheels: string;
    events: any;
    rangeSettings: MbscRangeOptions = {
        lang: 'he',
        controls: ['date', 'time'],
        dateWheels: '|D M d|',
        startInput: '#startDate',
        endInput: '#endDate',
        tabs: false,
        responsive: {
            large: {
                touchUi: false
            }
        },
        showSelector: false
    };

    daySettings: MbscEventcalendarOptions = {
        display: 'inline',
        lang: 'he',
        view: {
            eventList: { type: 'day' }
        },
        onPageChange: (event, inst) => {
            const day = event.firstDay;
            preventSet = true;
            this.navigate(this.monthCal.instance, day);
            this.eventDate = [day, new Date(day.getFullYear(), day.getMonth(), day.getDate(), day.getHours() + 2)];
        },
        onEventSelect: (event, inst) => {
            if (event.domEvent.target.classList.contains('md-delete-btn')) {
                mobiscroll.confirm({
                    title: 'Confirm Deletion',
                    message: 'Are you sure you want to delete this item?',
                    okText: 'Delete',
                    callback: (res) => {
                        if (res) {
                            //remove element by id
                            const events = this.events;
                            const index = events.indexOf(events.filter(x => x.id === event.event.id)[0]);

                            events.splice(index, 1);

                            mobiscroll.toast({
                                message: 'Deleted'
                            });
                        }
                    }
                });
            }
        }
    };

    monthSettings: MbscEventcalendarOptions = {
        display: 'inline',
        lang: 'he',
        view: {
            calendar: { type: 'month' }
        },
        onSetDate: (event, inst) => {
            if (!preventSet) {
                const day = event.date;
                this.navigate(this.dayCal.instance, day);
                this.eventDate = [day, new Date(day.getFullYear(), day.getMonth(), day.getDate(), day.getHours() + 2)];
            }
            preventSet = false;
        }
    };

    popupSettings: MbscPopupOptions = {
        display: 'center',
        lang: 'he',
        cssClass: 'mbsc-no-padding',
        buttons: [{
            text: 'הוסף אירוע',
            handler: 'set'
        },
            'cancel'
        ],
        headerText: 'הוסף אירוע חדש',
        onSet: (event, inst) => {
            this.events.push({
                id: id,
                start: this.eventDate[0],
                end: this.eventDate[1],
                text: (this.eventText || 'New Event'),
                title: this.eventText || 'New Event',
                description: this.eventDesc,
                allDay: this.allDay,
                free: this.isFree === 'free'
            });
            this.eventText = '';
            this.eventDesc = '';
            id += 1;
            // Navigate the calendar to the new event's start date
            this.monthCal.instance.navigate(this.eventDate[0], true);
        }
    };
    bridalStuffColors: {} = {};
    colorIndex: number = 0;

    constructor(private http: HttpClient,
        private _calendarService: CalendarService) { }

    ngOnInit() {
        this._calendarService.getAllEvents().subscribe(events => {
            console.log(events);
            this.events = events;
            this.events.forEach(event => {
                event['d'] = new Date(event['start'])
                event['text'] = event['title']
                delete event['title'];
                this.addStuffIdToColorsObj(event['BridalStaffId']); // add the id and color to the colors obj
                event['color'] = this.bridalStuffColors[event['BridalStaffId']]
            });
        })
        // this.http.jsonp('https://trial.mobiscroll.com/events/', 'callback').subscribe((resp: any) => {
        //     this.events = resp;
        //     var id = 1;
        //     this.events.forEach(event => {
        //         event['id'] = id;
        //         id += 1;
        //         event['d'] = new Date(event['start'])
        //     });
        //     console.log(resp)
        // });
    }
    addStuffIdToColorsObj(staffId: any) {
        debugger
        // if the stuff id is not already in the obj -> add it
        if (!(staffId in this.bridalStuffColors)) {
            this.bridalStuffColors[staffId] = this.colorArray[this.colorIndex];
            this.colorIndex += 1;
        }
    }


    navigate(inst, val) {
        if (inst) {
            inst.navigate(val);
        }
    }

    change() {
        this.control = this.allDay ? ['date'] : ['date', 'time'];
        this.wheels = this.allDay ? 'MM dd yy' : '|D M d|';
    }

    addEvent(): void {
        if (this.eventDate && this.eventText) {
            this.events.push({
                d: this.eventDate,
                text: this.eventText
            });
        }
    }

    //item is tapped
    onItemTap(event, inst) {
        console.log('onItemTap')
    }
}