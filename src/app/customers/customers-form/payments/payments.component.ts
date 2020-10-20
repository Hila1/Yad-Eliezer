import { Component } from "@angular/core";
import { element } from 'protractor';
import { CustomersService } from 'src/app/services/customers.service';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'payments',
    styleUrls: ['payments.css'],
    templateUrl: 'payments.component.html'
})
export class PaymentsComponent {
    paymentReasons: any[] = [];
    actualPayments: any[] = null;
    paymentsSum = 0;
    bridalEventId: string;

    constructor(private _globalFunctionsService: GlobalFunctionsService,
        private _customerService: CustomersService) { }

    ngOnInit() {
        this._customerService.getBridalEventId().subscribe(bridalEventId =>{
            
        this.bridalEventId = bridalEventId;    
        let filterObj = [{
                nameField: 'BridalEventId',
                Value: this.bridalEventId,
                Operator: "="
            }]
            this._globalFunctionsService.getTableData("BridalPayment‏", null, filterObj).subscribe(tableData => {
                console.log(tableData[0]);
                this.actualPayments = tableData[0];
                this.actualPayments.forEach(element => {
                    this.paymentsSum += +element['Amount']
                })
            })
        })
        this._globalFunctionsService.getTableData('Parametrim‏').subscribe(params => {            
            this.paymentReasons.push({cost: params[0][0]["BridalItemPrice"], reason: "עלות שמלה", dammage: ""})

            this.addMorePaymentsToTable();
        })
    }
    addMorePaymentsToTable() {
        //get item schuduling for dammage testing
        let filterObj = {
                nameField: 'BridalEventId',
                Value: this.bridalEventId,
                Operator: "="
            }
            this._globalFunctionsService.getTableData('BridalEventItem', undefined, [filterObj])
            .subscribe(itemSchedulingData => {      
                itemSchedulingData.forEach(item => {
                    if(item['CostOfDamage'] && +item['CostOfDamage']>0){
                        this.paymentReasons.push({ cost: item['CostOfDamage'], reason: item['DamageDescription'],  dammage:"" });
                    }
                })       
            })

        // })

    }

    // this function returns shorter date format
    cutDate(date: string) {
        return date.slice(0, -13)
    }
}