import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'fixes-item',
    styleUrls: ['fixes-item.css'],
    templateUrl: 'fixes-item.component.html',
})
export class FixesItemComponent {
    @Input() stockBridalItemData: any[] = null;
    levelText =  "- רמה:";

    constructor(private _globalFunctionsService: GlobalFunctionsService,
        private _snackBar: MatSnackBar) { }

    ngOnInit() {
        console.log(this.stockBridalItemData);

        // reformat DueDate
        this.stockBridalItemData.forEach(item => {
            item['DueDate'] = item['DueDate'].slice(0, -13)
        });

        this.getFixTypeAndSeamLevel();


    }

    getFixTypeAndSeamLevel() {
        this._globalFunctionsService.getTableData('SeamLevel').subscribe(seamLevelList => {
            var seamLevelObj = this.getOrderedObj("SeamLevelId", seamLevelList[0]);

            this._globalFunctionsService.getTableData("SeamType").subscribe(fixTypes => {
                // make an obj of SeamTypeId as key and [Description,SeamLevelId] as value;
                var typesAndLevelObj = []
                fixTypes[0].forEach(fixType => {
                    typesAndLevelObj[fixType['SeamTypeId']] = [fixType['Description'], seamLevelObj[fixType['SeamLevelId']]];
                });
                this.stockBridalItemData.forEach(item => {
                    item['SeamTypeId'] = typesAndLevelObj[item['SeamTypeId'][0]];
                    item['SeamLevelId'] = typesAndLevelObj[item['SeamTypeId'][1]];
                })
            });
        });
    }

    getOrderedObj(key: string, arrayToIterate: any[]) {
        var finalObj = {};
        arrayToIterate.forEach(element => {
            finalObj[element[key]] = element['Description'];
        })
        return finalObj;
    }

    viewDoc(item: string) {
        if (item == null) {
            this.openSnackBar("סליחה, לא מצאנו את המסמך", "אוקי");
            return;
        }
        var url = this._globalFunctionsService.getUrlPage() + "/NewPhp/Libraries/Documents/Download/DownloadFile.php";
        item = item.slice(19, item.length);
        // request from server and download the image
        window.open(url + '?pathToOpen=' + item);
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }
}