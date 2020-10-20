import { Component } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
    selector: 'customers-form-fixes',
    styleUrls: ['customers-form-fixes.css'],
    templateUrl: 'customers-form-fixes.component.html',
})
export class CustomersFormFixesComponent {
    seamStressList: any = null;
    dataSource: any[] = null;

    constructor(private _globalFunctionsService: GlobalFunctionsService,
        private _customerService: CustomersService,
        private _stockService: StockService) { }

    ngOnInit() {

        this._customerService.getBridalEventId().subscribe(bridalEventId => {
            let filterObj = {
                nameField: 'BridalEventId',
                Value: bridalEventId,
                Operator: "="
            }
            this._globalFunctionsService.getTableData('BridalEventItem', undefined, [filterObj]).subscribe(data => {
                if (data[0].length > 0) {

                    this.getSeamStressList();

                    this.dataSource = data[0];
                    this.dataSource.forEach(element => {
                        this._stockService.getSingleStockItem(element.StockBridalItemId).subscribe(itemData => {
                            element['BridalTypeItem'] = itemData[0]['BridalTypeItem'];
                            element['BridalItem_Description'] = itemData[0]['BridalItem_Description'];
                            element['Mct'] = itemData[0]['Mct'];
                        })

                    })
                }
            })
        })
    }

    getSeamStressList() {
        this._globalFunctionsService.getTableData('SeamStressList‏').subscribe(data => {
            this.seamStressList = data[0];
        })
    }

    getSeamsForSingleItem(stockBridalItemId: string){
        let res = []
        this.seamStressList.forEach(element => {
            if(element['StockBridalItemId'] == stockBridalItemId)
                res.push(element);
        });
        return res;
    }
}