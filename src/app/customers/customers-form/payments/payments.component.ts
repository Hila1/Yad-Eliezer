import { Component } from "@angular/core";
import { resolve4 } from "dns";
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
    paymentReasonTypes: any[];
    paymentMethodTypes: any[];

    constructor(
        private _globalFunctionsService: GlobalFunctionsService,
        private _customerService: CustomersService
    ) { }

    ngOnInit() {
        this.getEventId();

    }
    getPaymentMethodTypes() {
        this._globalFunctionsService.getTableData('PaymentMethod').subscribe(data => {
            this.paymentMethodTypes = data[0];
            this.actualPayments.forEach(element => {
                element['PaymentMethodId'] = this.getPaymentMethod(element['PaymentMethodId']);
            })
        })
    }

    getPaymentReasonTypes() {
        this._globalFunctionsService.getTableData('PaymentReason').subscribe(data => {
            this.paymentReasonTypes = data[0];
            this.actualPayments.forEach(element => {
                element['PaymentReasonId'] = this.getPaymentReason(element['PaymentReasonId']);
            })
        })
    }

    getDressPrice() {
        this._globalFunctionsService.getTableData('Parametrim‏').subscribe(params => {
            this.paymentReasons.push({
                cost: params[0][0]["BridalItemPrice"],
                reason: "עלות שמלה",
                dammage: ""
            })
            this.addMorePaymentsToTable();
        })
    }

    getEventId() {
        this._customerService.getBridalEventId().subscribe(bridalEventId => {
            this.bridalEventId = bridalEventId;
            let filterObj = [{
                nameField: 'BridalEventId',
                Value: this.bridalEventId,
                Operator: "="
            }]
            this.getBridalPayment(filterObj);
            this.getDressPrice();
        })
    }

    getBridalPayment(filterObj) {
        this._globalFunctionsService.getTableData("BridalPayment‏", null, filterObj).subscribe(tableData => {
            console.log(tableData[0]);
            this.actualPayments = tableData[0];
            this.getPaymentReasonTypes();
            this.getPaymentMethodTypes();

            this.actualPayments.forEach(element => {
                this.paymentsSum += +element['Amount']
                element['DepositDate'] = this.cutDate(element['DepositDate']);
            })
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
                    if (item['CostOfDamage'] && +item['CostOfDamage'] > 0) {
                        this.paymentReasons.push({
                            cost: item['CostOfDamage'],
                            reason: item['DamageDescription'],
                            dammage: ""
                        });
                    }
                })
            })
    }

    getPaymentReason(paymentReason: any) {
        let res = ""
        this.paymentReasonTypes.forEach(type => {
            if (type['PaymentReasonId'] == paymentReason) {
                res = type['Description'];
            }
        })
        return res;
    }

    getPaymentMethod(paymentMethod: any) {
        let res = "";
        this.paymentMethodTypes.forEach(type => {
            if (type['PaymentMethodId'] == paymentMethod) {
                res = type['Description'];
            }
        })
        return res;
    }

    // this function returns shorter date format
    cutDate(date: string) {
        return date.slice(0, -13)
    }

    getSumOfPaymentReasons(): number {
        let sum = 0;
        this.paymentReasons.forEach(reason => {
            sum += +reason['cost']
        })
        return sum;
    }
}