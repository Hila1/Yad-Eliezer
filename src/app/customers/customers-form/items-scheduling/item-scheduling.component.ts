import { Component, ViewChild } from "@angular/core";
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { StockService } from 'src/app/services/stock.service';
// import { ItemData } from './item-data/item-data.component';
import { MatAccordion } from '@angular/material/expansion';
import { element } from 'protractor';
import { CustomersService } from 'src/app/services/customers.service';
// import { data } from 'jquery';

@Component({
    selector: 'item-scheduling',
    styleUrls: ['item-scheduling.css'],
    templateUrl: 'item-scheduling.component.html'
})
export class ItemSchedulingComponent {
    dataSource: any[];
    DocumentForPerson: any[];
    @ViewChild(MatAccordion) accordion: MatAccordion;
    items: any[] = null//['hello', 'world','hello', 'world','hello', 'world','hello', 'world','hello', 'world','hello', 'world'];
    itemsIds: any;
    itemsNames: any[];

    constructor(private _globalFunctionsService: GlobalFunctionsService,
        private _stockService: StockService,
        private _customerService: CustomersService) { }


    ngOnInit() {
        // this._customerService.getCustomerFileByCode(this._globalFunctionsService.getElementID()).subscribe(data => { // get BridalEventId from server
        this._customerService.getBridalEventId().subscribe(bridalEventId => {
            
            let filterObj = {
                nameField: 'BridalEventId',
                Value: bridalEventId,
                Operator: "="
            }

            this._globalFunctionsService.getTableData('BridalEventItem', undefined, [filterObj]).subscribe(data => {
                this.dataSource = data[0]
                console.log(this.dataSource);
                this.itemsNames = [];
                this.dataSource.forEach(element => {
                    this._stockService.getSingleStockItem(element.StockBridalItemId).subscribe(itemData => {
                        element['BridalTypeItem'] = itemData[0]['BridalTypeItem'];
                        element['BridalItem_Description'] = itemData[0]['BridalItem_Description'];
                        element['Mct'] = itemData[0]['Mct'];
                        element['Attachment'] = JSON.parse(itemData[0]['Attachment'])[0];
                        this.itemsNames.push(element.BridalTypeItem)
                    })
                });
                this.getItems(); // get types items from the server
            })

        })
    }

    getItems() {
        this._globalFunctionsService.getTableData('bridalTypeItem', 'Description').subscribe(data => {
            this.items = data[0];
            // add every item an 'icon' field for the footer
            this.items.forEach(element => {
                element['icon'] = this.itemsNames.includes(element.Description) ? "✓" : "✗";
            })
        })
    }

    getItemColor(item: any) {
        return item['icon'] == "✓" ? { color: '#178f19' } : { color: 'rgb(207, 11, 11)' };
    }
}


