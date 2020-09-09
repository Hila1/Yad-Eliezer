import { Component, Input } from '@angular/core';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { SaveService } from 'src/app/services/save.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialog } from 'src/app/ui/custom-dialog';
import { FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
    selector: 'update-stock-table',
    styleUrls: ['update-stock-table.css'],
    templateUrl: 'update-stock-table.component.html',
    inputs: [`displayMode`]
})

export class UpdateStockTableComponent {
    showSpinner = false;
    private tableName = "StockBridalItem";
    private tableUniqeKey = "StockBridalItemId";
    id: string;
    deletedItemIndex: number;

    displayedColumns: string[] = ['Mct', 'Size', 'Condition', 'lengthItem', 'Location', 'Comments', 'Delete'];
    dataSource: any = [];
    originalDataSource: any = [];
    sizeArray = [];
    conditionArray = [];

    shouldDeleteItem = false;
    private elementsToDelete = [];
    private elementsToSave = [];
    private elementsToUpdate = [];

    divStyle = {};
    buttonStyle = {};
    disableForm = false;
    private _displayMode: any[];
    cellStyle = {};
    headerCellStyle = {};
    mctExistance: boolean;
    errorMsg: string;


    @Input()
    set displayMode(displayMode: any[]) {
        // change style of the component to dark / light
        this.cellStyle = displayMode[0];
        this.headerCellStyle = displayMode[1];
        this.buttonStyle = displayMode[1];
        this.disableForm = displayMode[2];
        this._displayMode = displayMode;
    }

    get displayMode(): any[] { return this._displayMode; }

    constructor(private _globalFunctionService: GlobalFunctionsService,
        private _saveService: SaveService,
        private route: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        public dialog: MatDialog,
        private _searchTableService: GlobalFunctionsService) {

        this.divStyle = this.displayMode ? this.displayMode[0] : {};
        this.buttonStyle = this.displayMode ? this.displayMode[1] : {};
    }

    ngOnInit() {
        // get optional router params
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
        })

        if (this.id != '-1') { this.getMct(); }

        this.getSizeArray();

        this.getConditionArray();
    }

    getSizeArray() {
        // get list of sizes from the service
        this.showSpinner = true;
        this._searchTableService.getTableData("Size", "Description").subscribe(data => {
            this.sizeArray = data[0];
            this.showSpinner = false;
        });
    }

    getConditionArray() {
        // get list of conditions types from the service
        this.showSpinner = true;
        this._searchTableService.getTableData("Condition", "Description").subscribe(data => {
            this.conditionArray = data[0];
            this.showSpinner = false;
        });
    }
    //here
    getMct() {
        // get list of item types from the service
        this.showSpinner = true;
        this._globalFunctionService.getTableData(this.tableName, undefined,
        [{
                nameField: 'BridalItemId',
                Value: this.id,
                Operator: "="
            }])
            .subscribe(data => {
                this.dataSource = Object.assign([], data[0]);
                this.copyDataToOriginal();
                this.showSpinner = false;
                console.log('item types')
                console.log(this.dataSource);
            });
    }

    /**
     *  This function makes new object copy of each object from the data
     */
    copyDataToOriginal() {
        this.dataSource.forEach(element => {
            element["hint"] = "";
            this.originalDataSource.push(Object.assign({}, element))
        });
    }

    /**
     * this function let the user add new empty row to the table.
     */
    addEmptyRow() {
        // get empty object for saving new data row
        this._saveService.getEmptyObject(this.tableName).subscribe(
            data => {
                // add empty row to the list of data
                this.dataSource.push(data);
                // refresh the table so the new empty row will display
                this.dataSource = this.dataSource.filter(i => i);
            })
    }


    handleSnackBar(row: any) {
        var message = "הפריט נמחק"
        var action = "לא! ביטול!"

        this.deleteItem(row);
        let snackBarREf = this._snackBar.open(message, action, {
            duration: 3000,
        });
        snackBarREf.onAction().subscribe(() => {
            this.cancelItemDeletion()
        })
    }
    deleteItem(row: any) {
        // add this element to the list of elements to delete
        this.elementsToDelete.push(row);
        // find the index of the row
        this.deletedItemIndex = this.dataSource.indexOf(row, 0);
        // remove the row from dataSource
        this.dataSource.splice(this.deletedItemIndex, 1);
        // refresh table
        this.dataSource = this.dataSource.filter(i => i);
    }

    cancelItemDeletion() {
        // find the item location
        let lastItemIndex = this.elementsToDelete.length - 1;
        // add the item back to the data source
        this.dataSource.splice(this.deletedItemIndex, 0, this.elementsToDelete[lastItemIndex]);
        // remove the item from the elementsToDelete list 
        this.elementsToDelete.splice(lastItemIndex);
        // refresh table
        this.dataSource = this.dataSource.filter(i => i);
    }

    /**
     * This function saves all the changes in the data source and updates the DB
     * (being activated from parent component)
     */
    saveTableChanges(id: string) {
        this.id = id;
        // detect the changes and update the arrays
        this.detectChanges();
        // use the upadated arrays to save \ update \ delete
        this.updateServer();
        this.deleteFromServer();
        this.addToServer();

        // update originalDataSource
        this.updateOriginalDataSource();
        // init arrays
        this.elementsToDelete = [];
        this.elementsToUpdate = [];
        this.elementsToSave = [];
    }
    updateOriginalDataSource() {
        this.originalDataSource = [];
        this.dataSource.forEach(element => {
            this.originalDataSource.push(Object.assign({}, element));
        });
    }

    deleteFromServer() {
        this.elementsToDelete.forEach(element => {
            element["BridalItemId"] = this.id;
            console.log("ill delete: ");
            console.log(element);
            this._globalFunctionService.delete(this.tableName, "StockBridalItemId", element.StockBridalItemId);
        });
    }


    /**
     * This function adds new rows to the table in the server
     */
    addToServer() {
        this.elementsToSave.forEach(element => {
            this._globalFunctionService.update(null, element, this.tableName).subscribe(data => {
                try {
                    console.log("item id is: " + JSON.parse(data)[0]);
                } catch (error) {
                    // show snack bar
                    var message = "היתה שגיאה בהוספת שורה חדשה לטבלה"
                    var action = "אוקי"
                    this._snackBar.open(message, action);
                }
            })
        });
    }


    /**
     * This function detects whether any changes to the data has been made
     */
    detectChanges() {
        this.dataSource.forEach(element => {
            // if this is a new row
            if (element[this.tableUniqeKey] == -1) {
                element["BridalItemId"] = this.id;
                this.elementsToSave.push(element);
            }
            // this row is existing
            else {
                // compare with every element of the original dataSource
                for (let originalElement of this.originalDataSource) {
                    // find the original element
                    if (originalElement[this.tableUniqeKey] == element[this.tableUniqeKey]) {
                        // if there is a change between the original to the final element
                        if (JSON.stringify(originalElement) !== JSON.stringify(element)) {
                            console.log("there was a change");
                            // add the pair of original, active object to the list
                            this.elementsToUpdate.push({ original: originalElement, active: element });
                        }
                        // no need for more looping (we found already the needed element)
                        break;
                    }
                }
            }
        });
    }

    /**
     *  This function updates the DB for changes only in the data source
     */
    updateServer() {
        this.elementsToUpdate.forEach(element => {
            this._globalFunctionService.update(element.original, element.active, this.tableName).subscribe(data => {
                console.log("table saved successfuly ");
            })
        });
    }

    checkForMctExistance(value: any, row) {
        // make api request with the given Mct to check whether this Mct is already exist
        this._globalFunctionService.getTableData(this.tableName, undefined,
            [{
                nameField: 'Mct',
                Value: value,
                Operator: "="
            }])
            .subscribe(data => {
                // if this mct is already exist
                var hint = data[0].length > 0 &&
                    // and in case of edit, this is not the same row
                    data[0][0]["StockBridalItemId"] != row["StockBridalItemId"] ? 'מק"ט קיים' : ""
                // get index of the row in the data source
                var index = this.dataSource.findIndex(x => x == row);
                //upadte hint in data source
                this.dataSource[index]['hint'] = hint;
            });

    }

    hasChangesDone() {
        let res = false;
        this.detectChanges();
        if (this.elementsToDelete.length > 0 ||
            this.elementsToSave.length > 0 ||
            this.elementsToUpdate.length > 0) {
            res = true
        }
        //init the arrays
        this.elementsToSave = [];
        this.elementsToUpdate = [];
        return res;
    }
}


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
