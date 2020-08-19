import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StockService } from 'src/app/services/stock.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'details-card',
  templateUrl: 'details-card.component.html',
  styleUrls: ['details-card.css'],
})
export class DetailsCardComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  original = {};
  dataSource = null
  showSpinner = false;
  panelOpenState = false;

  constructor(
    private route: ActivatedRoute,
    // private _globalFunctionService: GlobalFunctionsService,
    // private _snackBar: MatSnackBar,
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
  }
}