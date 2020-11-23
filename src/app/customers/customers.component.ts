import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomersService } from '../services/customers.service';
// import { data } from 'jquery';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'customers',
  styleUrls: ['customers.css'],
  templateUrl: 'customers.component.html',
})
export class CustomersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['BridalEventId', 'PersonId', 'PersonName', 'Addresss', 'PhoneNumber', 'EventDate', 'StatusSupportActivity', 'StatusBridalEvent'];
  dataSource: any = [];
  errorMsg: any;
  showSpinner: boolean = true;

  constructor(private _customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this._customersService.getCustomers().subscribe(data => {
      this.dataSource = data;
      this.removeUnneededData();
      this.dataSource = new MatTableDataSource(this.dataSource);

      this.dataSource.sort = this.sort;
      this.showSpinner = false;
      console.log(this.dataSource);
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   *  This function removes from data source all the keys which are not in the displayed columns
   *  to make sure the filtering wouldnt be mixed with unneeded columns 
   */
  removeUnneededData() {
    this.dataSource.forEach(element => {
      for (let key in element) {
        if (this.displayedColumns.indexOf(key) <= -1 && key != 'color' && key != 'SupportActivityId') { delete element[key]; }
      }
      element['EventDate'] = element['EventDate'].slice(0, - 13); // hide the end of the date string
      element['Addresss'] = element['Addresss'] ? element['Addresss'].substring(0, 25) : ""; // show only the fitst 25 chars
      element['PhoneNumber'] = element['PhoneNumber'] ? element['PhoneNumber'].split(',')[0] : ""; //show only the first phone number
    });
  }

  rowClicked(element: any) {
    this.router.navigate([element.SupportActivityId], { relativeTo: this.route })
  }
}