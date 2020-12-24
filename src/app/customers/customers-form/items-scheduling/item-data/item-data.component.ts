import { Component, Input } from "@angular/core";
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'item-data',
    styleUrls: ['item-data.css'],
    templateUrl: 'item-data.component.html'
})
export class ItemData {
    @Input() AttachedFile: string = null;
    @Input() SupportActivityId: any = null;
    @Input() Comment: string = null;
    @Input() DeliveryStatusId: Number = null;
    @Input() DeliveryDate: string = null;
    @Input() ReturnDate: string = null;

    @Input() CostOfDamage: string = null;
    @Input() CurrencyCostOfDamageId: string = null;
    @Input() DamageDescription: string = null;
    @Input() ReturnStatusId: string = null;

    DocumentForPerson: any[];

    constructor(private _globalFunctionsService: GlobalFunctionsService) { }
    ngOnInit() {
        this.modifyData();
        this.getReturnStatusTypes();
    }
    getReturnStatusTypes() {
        this._globalFunctionsService.getTableData('ReturnStatus‏').subscribe(data => {
            data[0].forEach(status => {
                if(status["ReturnStatusId"] == this.ReturnStatusId){
                    this.ReturnStatusId = status['Description'];
                }
            })
        })
    }

    modifyData() {
        this.DeliveryDate = this.DeliveryDate ? this.DeliveryDate.slice(0, 10) : "";
        this.ReturnDate = this.ReturnDate ? this.ReturnDate.slice(0, 10) : "";
        this.CurrencyCostOfDamageId = this.CurrencyCostOfDamageId && this.CurrencyCostOfDamageId == '2' ? '$' : '₪'
    }

    shouldCheck(number: Number) {
        // DeliveryStatusId = 0 -> no checking
        // DeliveryStatusId = 1 -> check first
        // DeliveryStatusId = 2 -> check all
        return this.DeliveryStatusId > number;
    }

    // download document
    viewDoc() {
        var url = this._globalFunctionsService.getUrlPage() + "/NewPhp/Libraries/Documents/Download/DownloadFile.php";
        var item = this.AttachedFile.slice(19, -1);
        //שליחה לשרת ופתיחת התמונה המבוקשת
        window.open(url + '?pathToOpen=' + item);
    }
}