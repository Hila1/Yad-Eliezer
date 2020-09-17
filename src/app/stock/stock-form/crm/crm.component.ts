import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { StockService } from 'src/app/services/stock.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'crm',
    templateUrl: 'crm.component.html',
    styleUrls: ['crm.css'],
})
export class CRMComponent {
    displayedColumns: string[] = [
        "InsertDate",
        "FullName",
        "PositionBridalItem",
        "Comment"

        // "BridalEventItemId",
        // "Comment",
        // "CrmBridalItemId",
        // "FullName",
        // "InsertDate",
        // "PositionBridalItem",
        // "PositionBridalItemId",
        // "StockBridalItemId"
    ];



    dataSource = null;
    showSpinner = true;

    @ViewChild(MatSort) sort: MatSort;

    constructor(private _stockService: StockService,
        private router: Router,
        private route: ActivatedRoute,
        private _globalFunctionsService: GlobalFunctionsService) { }


    ngOnInit() {

        this.showSpinner = true
        this._stockService.getItemCRM(this._globalFunctionsService.getElementID()).subscribe(data => {
            this.dataSource = data;
            this.removeUnneededData()
            this.dataSource = new MatTableDataSource(this.dataSource);
            //         // this.dataSource.sort = this.sort;
            this.showSpinner = false;
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // /**
    // *  This function removes from data source all the keys which are not in the displayed columns
    // *  to make sure the filtering wouldnt be mixed with unneeded columns 
    // */
    removeUnneededData() {
        this.dataSource.forEach(element => {
            for (let key in element)
                if (this.displayedColumns.indexOf(key) <= -1) { delete element[key]; }
            // element["IsActive"] = element["IsActive"] === "1" ? "✓" : "✗"
        });
    }
}