import { Component, Input } from '@angular/core';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';

@Component({
    selector: 'fixes-item',
    styleUrls: ['fixes-item.css'],
    templateUrl: 'fixes-item.component.html',
})
export class FixesItemComponent {
    @Input() stockBridalItemData: any[] = null;

    constructor(private _globalFunctionsService: GlobalFunctionsService) { }

    ngOnInit() {
        console.log(this.stockBridalItemData);
    }

    
    viewDoc(item : string) {
        var url = this._globalFunctionsService.getUrlPage() + "/NewPhp/Libraries/Documents/Download/DownloadFile.php";
        item = item.slice(19, item.length);
        // request from server and download the image
        window.open(url + '?pathToOpen=' + item);
    }
}