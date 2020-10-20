import { Component } from "@angular/core";
import { CustomersService } from 'src/app/services/customers.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { element } from 'protractor';

@Component({
  selector: 'room-scheduling',
  styleUrls: ['room-scheduling.css'],
  templateUrl: 'room-scheduling.component.html'
})

export class RoomScheduling {
  displayedColumns: string[] = ['ScheduleDate',
    'RoomScheduleId',
    'BridalStaffId',
    'MeetingPurposeId',
    'ActualTime',
    'Comment', 'Actions'];
  dataSource: any = null;
  errorMsg: any;
  showSpinner: boolean = true;

  constructor(private _customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,
    private _globalFunctionsService: GlobalFunctionsService) { }

  ngOnInit() {
    // Get the data from the table RoomSchedule
    this._globalFunctionsService.getTableData('RoomSchedule').subscribe(roomSchedulingArray => {
      this.showSpinner = false;
      this.dataSource = roomSchedulingArray[0];

      this.removeRooms();

      this.changeDateSchedulingFormat();

      this.getBridalStuff();

      this.getMeetingPurpose();
    })
  }

  removeRooms() {
    let temporaryArray: any = []
    this._customersService.getBridalEventId().subscribe(bridalEventId => {
      // remove irrelevant  rooms
      this.dataSource.forEach(element => {
        if (element['BridalEventId'] == bridalEventId) {
          // if(this.dataSource == null) {this.dataSource = []} //init the array if needed
          temporaryArray.push(element);
        }
      })
      this.dataSource = temporaryArray;

    });
  }

  getMeetingPurpose() {
    this._globalFunctionsService.getTableData('MeetingPurpose‏').subscribe(meetingPurposeData => {
      let meetingPuposeDataObj = this.orderArrayIntoObject(meetingPurposeData[0], 'MeetingPurposeId');
      this.dataSource.forEach(element => {
        element['MeetingPurposeId'] = meetingPuposeDataObj[element['MeetingPurposeId']];
      });
    })
  }


  getBridalStuff() {
    this._globalFunctionsService.getTableData('BridalStaff').subscribe(bridalStaffData => {
      let bridalStaffDataObj = this.orderArrayIntoObject(bridalStaffData[0], 'BridalStaffId');
      this.dataSource.forEach(element => {
        element['BridalStaffId'] = bridalStaffDataObj[element['BridalStaffId']];
      });
    })
  }

  changeDateSchedulingFormat() {
    this.dataSource.forEach(element => {
      element['ScheduleDate'] = element['ScheduleDate'].slice(0, -7); // remove last 7 chars
    });
  }

  /**
   * This function makes new obj with given keyName as keys and Description as values.
   * @param keyName is the key of the needed value from arrayToOrder
   * @param arrayToOrder is an array that contains the data objects from the table 
   */
  orderArrayIntoObject(arrayToOrder: any[], keyName: string) {
    let finalObject = {};
    // For each element in meetingPuposeData, create new (if needed) pair in finalObject -> {key=BridalStaffId, value=Description}
    arrayToOrder.forEach(element => {
      finalObject[element[keyName]] = element['Description'];
    });
    return finalObject
  }
}