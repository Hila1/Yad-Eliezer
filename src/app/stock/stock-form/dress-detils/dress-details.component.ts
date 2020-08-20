import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'dress-details',
  styleUrls: ['dress-details.css'],
  templateUrl: 'dress-details.component.html',
})

export class DressDetailsComponent implements OnInit {

  itemTypes = ['kkk', 'hhh', 'ppp', 'ggg'];
  reasons = ['111', '222', '333']

  original = {};
  dataSource = null
  showSpinner = false;


  constructor(
    private route: ActivatedRoute,
    private _globalFunctionService: GlobalFunctionsService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _stockService: StockService
  ) { }

  ngOnInit() {
    // get id from router params and use it to get the rest of the data
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.showSpinner = true
      this._stockService.getSingleStockItem(params.get('id')).subscribe(data => {
        this.original = Object.assign({}, data[0]);
        this.dataSource = Object.assign({}, data[0]);
        this.showSpinner = false;
      })
    })

    // get list of item types from the service
    this.showSpinner = true;
    this._globalFunctionService.getTableData("BridalTypeItem‏", "Description").subscribe(data => {
      this.showSpinner = false;
      this.itemTypes = data[0];
    });
  }
}