import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { ParamMap, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'customers-form',
    styleUrls: ['customers-form.css'],
    templateUrl: 'customers-form.component.html',
})
export class CustomersFormComponent implements OnInit {

    constructor(private _customerService: CustomersService,
        private route: ActivatedRoute) { }

    dataSource = null;

    ngOnInit() {
        // get optional router params
        this.route.paramMap.subscribe((params: ParamMap) => {

            this._customerService.getCustomerFileByCode(params.get('id')).subscribe(data => {
                this.dataSource = data[0]
                console.log(data[0]);
                this.fixData();
            });
        })
    }

    fixData() {
        let aa = this.dataSource["TakenDate"].slice(0, -13);
        this.dataSource["TakenDate"] = aa
    }
}