import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialog } from 'src/app/ui/custom-dialog';
import { DressesService } from 'src/app/services/dresses.service';

@Component({
  selector: 'dress-form',
  styleUrls: ['dress-form.css'],
  templateUrl: 'dress-form.component.html',
})

export class DressFormComponent {
  private tableName = "BridalItem";
  private tableUniqeKey = "BridalItemId";

  imagesSource = [{ src: "" }]
  id = "";
  imageIndex = 0;
  showSpinner: boolean = true;
  itemTypes: any[];
  colors: any[];

  params: ParamMap;
  type: string;
  shouldDelete: boolean;

  divStyle = {};
  buttonStyle = {};
  disableForm = false
  displayMode = [this.divStyle, this.buttonStyle, this.disableForm];

  divUnAvailableStyle = {
    background: 'gray',
    color: 'light-gray'
  }
  buttonUnAvailableStyle = {
    background: 'gray',
    color: 'black'
  }

  original = {};
  dataSource = null


  constructor(
    private route: ActivatedRoute,
    private _globalFunctionService: GlobalFunctionsService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _dressService: DressesService
  ) { }

  ngOnInit() {
    // get id from router params and use it to get the rest of the data
    this.route.paramMap.subscribe((params: ParamMap) => {
      this._dressService.getSingleDress(params.get('id')).subscribe(data => {
        console.log(data);
        this.original = Object.assign({}, data[0]);
        this.dataSource = Object.assign({}, data[0]);
        this.initImagesSource();
      })
    })

    // get list of item types from the service
    this.showSpinner = true;
    this._globalFunctionService.getTableData("BridalTypeItem‏", "Description").subscribe(data => {
      this.showSpinner = false;
      this.itemTypes = data[0];
    });


    // get list of colors from the service
    this.showSpinner = true;
    this._globalFunctionService.getTableData("Color", "Description").subscribe(data => {
      this.showSpinner = false;
      this.colors = data[0];
    });
  }


  initImagesSource() {
    let imagesURLs = this.dataSource['Attachment'];
    this.imagesSource = JSON.parse(imagesURLs)
      .filter(i => i['src'] !== null) // remove items without src
      .sort((obj1, obj2) => obj1["viewFirst"] ? 1 : -1); // sort the images
  }

  openSnackBar() {
    var message = "הפריט נמחק"
    var action = "לא! ביטול!"

    /*give the user a chance to change his mind
     *deletion happends only after the snackbar is gone
     */
    let snackBarREf = this._snackBar.open(message, action, {
      duration: 3000,
    });
    snackBarREf.afterDismissed().subscribe(() => {
      this.deleteFromServer();
    })
    snackBarREf.onAction().subscribe(() => {
      this.shouldDelete = false;
      this.setAvailableDisplay();
    })
  }

  // make ui changes as like the item was deleted
  deleteItem() {
    this.openSnackBar();
    // hide the item display
    this.setNotAvailableDisplay();

    this.shouldDelete = true;
  }

  // make ui changes and disable buttons
  setNotAvailableDisplay() {
    this.divStyle = this.divUnAvailableStyle;
    this.buttonStyle = this.buttonUnAvailableStyle;
    this.disableForm = true;
        // change also display mode data since its effecting the table ux
    this.displayMode = [this.divUnAvailableStyle, this.buttonUnAvailableStyle, this.disableForm];

  }

  // make ui changes and unable buttons
  setAvailableDisplay() {
    this.divStyle = {};
    this.buttonStyle = {};
    this.disableForm = false;
    // change also display mode data since its effecting the table ux
    this.displayMode = [{}, {}, this.disableForm]
  }

  hasChangesDone(): boolean {
    return (JSON.stringify(this.original) !== JSON.stringify(this.dataSource))
  }

  updateServer() {
    this._globalFunctionService.update(this.original, this.dataSource, this.tableName).subscribe(data => {
      debugger
      console.log(data);
      debugger
      this.original = Object.assign({}, this.dataSource);
      // show snack bar
      var message = "נשמר בהצלחה"
      var action = "אוקי"
      this._snackBar.open(message, action);
    })
  }


  // delete permanently from derver
  deleteFromServer() {
    if (this.shouldDelete)
      // delete the item from the server, using table name, table uniqe key & value of the item for the key.
      this._globalFunctionService.delete(this.tableName, this.tableUniqeKey, this.id);
  }

  nextImage() {
    this.imageIndex = (this.imageIndex + 1) % this.imagesSource.length;
  }
  prevImage() {
    this.imageIndex = (this.imageIndex - 1);
    if (this.imageIndex < 0) {
      this.imageIndex = this.imageIndex + this.imagesSource.length
    }

  }

  deleteCurrentImage() {

  }

  addNewImage() {

  }

  ngOnDestroy() {
    if (this.hasChangesDone()) {
      let dialogRef = this.dialog.open(CustomDialog);
      dialogRef.afterClosed().subscribe(shouldSave => {
        debugger
        if (shouldSave == 'true') {
          debugger;
          this.updateServer();
        }
      })
    }
  }
}


