import { Component } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { data } from 'jquery';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'file-details',
    styleUrls: ['file-details.css'],
    templateUrl: 'file-details.component.html',
})
export class FileDetailsComponent {
    dataSource = null;

    constructor(private _customersService: CustomersService,
        private _globalFunctions: GlobalFunctionsService) { }

    ngOnInit() {
        this._customersService.getCustomerFileByCode(this._globalFunctions.getElementID()).subscribe(data => {
            this.dataSource = data[0];
            console.log(data[0]);
        })
    }
    getId() {
        
    }
}
