import { Component } from "@angular/core";
import { CustomersService } from 'src/app/services/customers.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

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
  dataSource: any = [];
  errorMsg: any;
  showSpinner: boolean = true;

  constructor(private _customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,
    private _globalFunctionsService: GlobalFunctionsService) { }

  ngOnInit() {
    this._globalFunctionsService.getTableData('RoomSchedule').subscribe(data => {
      // console.log(data[0]);
      this.dataSource = data[0];
      // this.dataSource = new MatTableDataSource(this.dataSource);
      this.modifyData();
      this.showSpinner = false;
    })
  }
  modifyData() {
    this.dataSource.forEach(element => {  
      element['ScheduleDate'] = element['ScheduleDate'].slice(0,-7);
    });
  }
}