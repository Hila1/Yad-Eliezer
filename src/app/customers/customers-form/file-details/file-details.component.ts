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
        private _globalFunctions: GlobalFunctionsService) { }

    ngOnInit() {
        this._customersService.getCustomerFileByCode(this._globalFunctions.getElementID()).subscribe(data => {
            this.dataSource = data[0];
            this.dataSource['TakenDate'] = this.dataSource['TakenDate'] ? this.dataSource['TakenDate'].slice(0, -13) : null;
            this.dataSource['EventDate'] = this.dataSource['TakenDate'] ? this.dataSource['EventDate'].slice(0, -13) : null;
            // this.dataSource['SumAmount‏'] = this.dataSource['SumAmount‏']? 'YES' :'NO'
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
        }
        ]
        this._globalFunctions.getTableData('DocumentForPerson'
            , undefined, filterObj
        )
            .subscribe(data => {
                console.log(data[0]);
                this.DocumentForPerson = data[0];
            })
    }

    viewDoc(index) {
        debugger;
        var url = this._globalFunctions.getUrlPage() + "/NewPhp/Libraries/Documents/Download/DownloadFile.php";
        // var item = index == 1 ? this.DocumentForPerson[0] : this.DocumentForPerson[1];
        console.log('index is: ' + index);
        var item = this.DocumentForPerson[index];
        item = item.Location.slice(19, item.Location.length);
        //שליחה לשרת ופתיחת התמונה המבוקשת
        window.open(url + '?pathToOpen=' + item);
    };
}
