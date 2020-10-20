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
    DocumentForPerson: any[];
    payed = 'x';

    constructor(private _customersService: CustomersService,
        private _globalFunctionsService: GlobalFunctionsService) { }

    ngOnInit() {
        this._customersService.getCustomerFileByCode(/*this._globalFunctionsService.getElementID()*/).subscribe(data => {
            this.dataSource = data[0];
            this.dataSource['TakenDate'] = this.dataSource['TakenDate'] ? this.dataSource['TakenDate'].slice(0, -13) : null;
            this.dataSource['EventDate'] = this.dataSource['TakenDate'] ? this.dataSource['EventDate'].slice(0, -13) : null;
            this.dataSource['SumAmount'] = this.dataSource['SumAmount'] ? '✓' : '	✗'
            // normalize payment method value
            if (this.dataSource['PaymentMethod']) {
                this.dataSource['PaymentMethod'] = this.dataSource['PaymentMethod'] == "צ'ק" ? 'check' : 'creditCard';
            }

            console.log(data[0]);

            // get files from server
            this.getFilesFromServer();
        })
    }

    getFilesFromServer() {

        let filterObj = [{
            nameField: 'SupportActivityId',
            Value: this.dataSource['SupportActivityId'],
            Operator: "="
            // }, {
            //     nameField: 'DocumentTypeId',
            //     Value: documentTypeId,
            //     Operator: "IN"
        }]
        
        this._globalFunctionsService.getTableData('DocumentForPerson'
            , undefined, filterObj
        )
            .subscribe(data => {
                this.DocumentForPerson = data[0];
            })
    }

    // download document
    viewDoc(index) {
        var url = this._globalFunctionsService.getUrlPage() + "/NewPhp/Libraries/Documents/Download/DownloadFile.php";
        var item = this.DocumentForPerson[index];
        item = item.Location.slice(19, item.Location.length);
        //שליחה לשרת ופתיחת התמונה המבוקשת
        window.open(url + '?pathToOpen=' + item);
    }

    shouldCheck(value: Number): Boolean {
        return this.dataSource['StatusSecurityCheckId'] >= value;
    }
}
