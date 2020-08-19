import { Component, ViewChild, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';

import { IStock } from '../interfaces/stock';
import { Router, ActivatedRoute } from '@angular/router';
import { StockService } from '../services/stock.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'stock',
  styleUrls: ['stock.css'],
  templateUrl: 'stock.component.html',
})
export class StockComponent implements OnInit {
  displayedColumns: string[] = ['StockBridalItemId', 'Mct', 'BridalTypeItem',
    'BridalItem_Description', 'Size', 'Condition', 'lengthItem', 'Location',
    'IsActive', 'ActiveReason', 'LastEventDate'];

  dataSource: any = [];
  showSpinner: boolean = true;
  states = [{0:"no"},{1:"yes"}];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private _dressesService: StockService, 
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.showSpinner = true;
    this._dressesService.getStock().subscribe(data => {
      console.log(data)
      this.dataSource = data;
      this.removeUnneededData()
      this.dataSource = new MatTableDataSource(this.dataSource);
      this.dataSource.sort = this.sort;
      this.showSpinner = false;
      console.log(data);
    });
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
        if (this.displayedColumns.indexOf(key) <= -1) { delete element[key]; }
      }
      element["IsActive"] = element["IsActive"] === "1" ? "✓" : "✗"
    });
  }

  rowClicked(element: IStock) {
    this.router.navigate(['/stock/stock-form', { id: element.StockBridalItemId }]);
  }

  removeElement(row: IStock) {
    console.log("ill remove:" + row.StockBridalItemId)
  }
}