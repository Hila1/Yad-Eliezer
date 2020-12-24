import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

/**
 * @title Stepper label bottom position
 */
@Component({
    selector: 'stepper',
    templateUrl: 'stepper.component.html',
    styleUrls: ['stepper.css'],
})
export class StepperComponent implements OnInit {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    newEvent = {
        fileId:"",
        RoomId:"",
        date:"",
        BridalStaffId:"",
        MeetingPurposeId:"",
        Comment:"",
        ActualTime:"",

        BridalStaff:"",
        Room:"",
        MeetingPurpose:"",
    }

    stuffArray = null;
    rooms = null;
    meetingPurposes = null;
    fileID: string;
    time = {hour: 13, minute: 30};


    constructor(private _formBuilder: FormBuilder,
        private _globalFunctionsService: GlobalFunctionsService,
        private datePipe: DatePipe,
        private _snackBar: MatSnackBar,
        ) { }

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
        this.fileID = this._globalFunctionsService.getElementID();
        this.getListOfStaff();
        this.getListOfRooms();
        this.getListOfMeetingPurpose();
    }

    getListOfMeetingPurpose() {
        this._globalFunctionsService.getTableData("MeetingPurpose‏").subscribe(data => {
            this.meetingPurposes = data[0];
            this.newEvent['meetingPurpose'] = this.meetingPurposes[0]['Description'];
            this.newEvent['MeetingPurposeId'] = this.meetingPurposes[0]['MeetingPurposeId'];
            this.newEvent['MeetingPurpose‏'] = this.meetingPurposes[0]['MeetingPurpose‏'];
        })
    }

    saveEvent() {
        let eventObj = {
            bridalEventId: this.newEvent['fileId'],
            RoomId:this.newEvent['RoomId'],
            ScheduleDate: this.datePipe.transform(this.newEvent['date'], 'yyyy-MM-dd'),
            BridalStaffId: this.newEvent['BridalStaffId'],
            MeetingPurposeId: this.newEvent['MeetingPurposeId'],
            Comment: this.newEvent['Comment'],
            ActualTime: this.newEvent['ActualTime']

        }
        this._globalFunctionsService.update(null, eventObj, "RoomSchedule‏").subscribe(data => {
            try{
                let id = JSON.parse(data)[0];
                console.log(id);
                if( !isNaN(+id)){
                    let message = "האירוע נשמר בהצלחה!"
                    this.openSnackBar(message);
                }
            }
            catch{
                console.log('error');
                return;
            }
            console.log(data);
        })
    }

    openSnackBar(message: string) {
        let action = "סבבה (בשבילך עדינה)"
        this._snackBar.open(message, action, {
          duration: 2000,
        });
      }
    

    getListOfRooms() {
        this._globalFunctionsService.getTableData("Room", "Description").subscribe(data => {
            this.rooms = data[0];
            this.newEvent['roomName'] = this.rooms[0]['Description'];
            this.newEvent['RoomId'] = this.rooms[0]['RoomId'];
            this.newEvent['Room'] = this.rooms[0]['Room'];

        })
    }
    getListOfStaff() {
        this._globalFunctionsService.getTableData("BridalStaff").subscribe(data => {
            this.stuffArray = data[0];
            this.newEvent['Description'] = this.stuffArray[0]['Description'];
            this.newEvent['BridalStaffId'] = this.stuffArray[0]['BridalStaffId'];
            this.newEvent['BridalStaff'] = this.stuffArray[0]['BridalStaff'];
        })
    }

    setDate(date) {
        // this.viewDate = date;
        this.newEvent['date'] = date;
    }
}
