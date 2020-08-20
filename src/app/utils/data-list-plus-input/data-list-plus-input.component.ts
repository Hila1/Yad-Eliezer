import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { SaveService } from 'src/app/services/save.service';

declare var $: any;

@Component({
    selector: 'app-data-list-plus-input',
    templateUrl: './data-list-plus-input.component.html',
    styleUrls: ['./data-list-plus-input.css']
})
export class DataListPlusInputComponent implements OnInit {
    inputModelId: string;

    @Output() inputModelChange = new EventEmitter<string>();//הנבחר הערך להחזיר עמ

    @Input() DataListId: string;//table id
    @Input() DataListDesc: string;// table description
    @Input() DataListTableName: string;//table name

    @Input() styleInput: any;// input design
    @Input() styleColumn: any;// cell design
    @Input() Label: any; // label of the cell

    @Input() disabled: any = false;

    ArrDataList: any[];//אופציות מערך

    @ViewChild('plusIcon', { static: false }) plusIcon: ElementRef;// plus icon
    @ViewChild('allColumn', { static: false }) allColumn: ElementRef;// cell
    @ViewChild('allInput', { static: false }) allInput: ElementRef;// input


    @Input()
    get inputModel() {
        return this.inputModelId;
    }

    set inputModel(val) {//המודל עידכון
        this.inputModelId = val;
        this.inputModelChange.emit(this.inputModelId);
    }

    inputModelDesc: string;//הערך של הטקסט שדה

    constructor(private _globalFunctionsService: GlobalFunctionsService,
        private _saveService: SaveService) { }

    ngOnInit() {
        // get the options array
        this._globalFunctionsService.getTableData(this.DataListTableName, this.DataListDesc)
            .subscribe(data => {
                this.ArrDataList = data[0];
                if (this.inputModelId) {// if a value was already selected
                    if (this.ArrDataList.filter(a => a[this.DataListId] == +this.inputModelId).length > 0) {
                        this.inputModelDesc = this.ArrDataList.filter(a => a[this.DataListId] == this.inputModelId)[0][this.DataListDesc];
                    } else {
                        this.inputModelDesc = '';
                    }
                }
            });
    }

    ngAfterViewInit() {
        //אם נשלח  עיצוב מיוחד
        //עבור אינפוט
        if (this.styleInput && this.styleInput != '') {
            var tmp = JSON.parse(this.styleInput);
            for (let obj of tmp) {
                for (let key in obj) {
                    this.allInput.nativeElement.style[key] = obj[key];
                }
            }
        }

        //עבור תא
        if (this.styleColumn && this.styleColumn != '') {
            var tmp = JSON.parse(this.styleColumn);
            for (let obj of tmp) {
                for (let key in obj) {
                    this.allColumn.nativeElement.style[key] = obj[key];
                }
            }
        }
    }

    clickAddDataList() {

        this._saveService.getEmptyObject(this.DataListTableName).subscribe((newObject: any) => { // new empty object
            newObject[this.DataListDesc] = this.inputModelDesc;
            this._saveService.saveData(newObject, this.DataListTableName).subscribe((data: any) => { // save
                var idnew = data[0];
                // refresh cell
                this._globalFunctionsService.getTableData(this.DataListTableName, this.DataListDesc).subscribe((response: any) => {
                    var all = response;
                    this.ArrDataList = all[0];
                    this.inputModel = idnew;
                    this.plusIcon.nativeElement.style.display = "none";
                }, function (error) {
                    // this.MessageService.loadMassageErrorConnectionServer(error);
                });
            }, function (error) {
                // this.MessageService.loadMassageErrorConnectionServer(error);
            });
        }, function (error) {
            // this.MessageService.loadMassageErrorConnectionServer(error);
        });
    }

    keyupFunction() {
        //after every keyboard click
        var flag = true
        // var input = event.target;
        if (this.ArrDataList) {
            for (var i = 0; i < this.ArrDataList.length; i++) {

                if (this.ArrDataList[i][this.DataListDesc] && this.ArrDataList[i][this.DataListDesc].indexOf(this.inputModelDesc) > -1) {//.toUpperCase()
                    flag = false;
                    if (this.ArrDataList[i][this.DataListDesc] == this.inputModelDesc) {//אותו ערך  
                        this.inputModel = this.ArrDataList[i][this.DataListId];
                        // this.plusIcon.nativeElement.style.display = "none";
                        break;
                    };
                };
            }
        }

        //אם אין אופציה יש להוסיף
        if (flag) {
            this.inputModel = null;
            this.plusIcon.nativeElement.style.display = "block";
        }
        else {
            this.plusIcon.nativeElement.style.display = "none";
        }

    }
}