import { Component } from "@angular/core";
import { CustomersService } from 'src/app/services/customers.service';
// import { Router, ActivatedRoute } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from "@angular/material/dialog";
import { StepperComponent } from "./stepper/stepper.component";

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
    private _globalFunctionsService: GlobalFunctionsService,
    private modalService: NgbModal,
    public dialog: MatDialog) { }

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
        // keep only the rooms with the same BridalEventId
        if (element['BridalEventId'] == bridalEventId) {
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
  addScheduling(){
    console.log("addScheduling()")
  }

  closeResult = ''; 
  
  // open(content) { 
  //   this.modalService.open(content, 
  //  {ariaLabelledBy: 'modal-basic-title'}).result.then(result => { 
  //     this.closeResult = `Closed with: ${result}`; 
  //   }, (reason) => { 
  //     this.closeResult =  
  //        `Dismissed ${this.getDismissReason(reason)}`; 
  //   }); }

  openDialog() {
    const dialogRef = this.dialog.open(StepperComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  
  } 
  
  private getDismissReason(reason: any): string { 
    if (reason === ModalDismissReasons.ESC) { 
      return 'by pressing ESC'; 
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) { 
      return 'by clicking on a backdrop'; 
    } else { 
      return `with: ${reason}`; 
    } 
  } 
}