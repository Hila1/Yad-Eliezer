import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router'
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CustomDialog } from 'src/app/ui/custom-dialog';
import { DressesService } from 'src/app/services/dresses.service';
import { SaveService } from 'src/app/services/save.service';
// import { catchError } from 'rxjs/operators';
import { UpdateStockTableComponent } from './update-stock-table/update-stock-table.component';
import * as $ from "jquery";
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'dress-form',
  styleUrls: ['dress-form.css'],
  templateUrl: 'dress-form.component.html',
})

export class DressFormComponent {
  @ViewChild(UpdateStockTableComponent) updateStockTableComponent: UpdateStockTableComponent;

  private tableName = "BridalItem";
  private tableUniqeKey = "BridalItemId";

  imagesSource = null
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
    background: 'rgb(63, 62, 62)',
    color: 'black'
  }

  original = null
  dataSource = null


  constructor(
    private route: ActivatedRoute,
    private _globalFunctionService: GlobalFunctionsService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _dressService: DressesService,
    private _SaveService: SaveService
  ) { }

  // goToTop() {
  //   document.getElementById('top').scrollIntoView();
  //   window.scrollTo(0,0);
  //   document.body.scrollTop = 0;
  // }

  ngOnInit() {
    // get id from router params and use it to get the rest of the data
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');

      if (this.id == "-1") { this.handleNewDress(); }
      else { this.handleExistingDress(); }
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

  handleNewDress() {
    // get new dress object from the server and set it to original source
    this._SaveService.getEmptyObject("BridalItem").subscribe(data => {
      this.dataSource = Object.assign({}, data[0]);
    });
  }

  handleExistingDress() {
    this._dressService.getSingleDress(this.id).subscribe(data => {
      this.original = Object.assign({}, data[0]);
      this.dataSource = Object.assign({}, data[0]);
      this.initImagesSource();
    })
  }


  initImagesSource() {
    this.imagesSource = JSON.parse(this.dataSource['Attachment']);
    // if the array is not empty and its first image has a source
    if (this.imagesSource != null && this.imagesSource[0]['src'] != null) {
      this.imagesSource = this.imagesSource.filter(i => i['src'] !== null) // remove items without src
        .sort((obj1, obj2) => obj1["viewFirst"] ? 1 : -1); // sort the images
    } else
      this.imagesSource = null; // make null for ui
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

  saveChanges() {
    // update the images array before testing
    this.dataSource['Attachment'] = JSON.stringify(this.imagesSource);
    if (this.hasChangesDone()) {
      this.updateServer();
    }
    // save changes from the table also
    this.updateStockTableComponent.saveTableChanges(this.id);
  }

  updateServer() {
    this._globalFunctionService.update(this.original, this.dataSource, this.tableName).subscribe(data => {
      // need to update the id in case of a new item - only now we have the id.
      if (this.id == '-1') { this.id = JSON.parse(data[0]) }
      this.original = Object.assign({}, this.dataSource);
      // show snack bar
      if (data.length < 3) { var message = "נשמר בהצלחה" }
      else { var message = 'שגיאה בשמירת השינויים בדו"ח' }
      this._snackBar.open(message, "אוקי");
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
    this.imagesSource.splice(this.imageIndex, 1);// remove the image from the array
    if (this.imagesSource.length == 0) {
      this.imagesSource = null;
    } else {
      this.nextImage();
    }
  }



  uploadFile(event, indexItem) {
    let files = event.target.files;
    if (files.length > 0) {
      var form_data = new FormData();
      form_data.append('file', files[0]);
      form_data.append('ImageBridalSalon', this.dataSource["BridalItemId"]);
      //copy file to server
      $.ajax({
        url: this._globalFunctionService.getUrlPage() + "/php/PHPTablet/PHPBridalSalon.php",// the API of the path
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: (php_script_response) => {
          var obj = JSON.parse(php_script_response);
          if (obj.Fail) {
            alert("לא ניתן לעלות קבצים מסוג זה")
          }
          else {
            //handling the file path
            indexItem = this.imagesSource.length;
            this.imagesSource[indexItem] = { src: null, viewFirst: false };
            this.imagesSource[indexItem].src = this._globalFunctionService.getUrlPage() + '/' + obj.replace(/\\\\/g, '/');

            // update the images index so the selector will display the new image
            this.imageIndex = indexItem;
          }
        },
        error: (php_script_response) => {
          alert("error: file size > 3MB")
        }
      });
    }
  }



  addNewImage() {
    // open image uploading dialog
    $("#fileLoader" + this.imageIndex).click();
  }


  ngOnDestroy() {
    // surrounded by try-finnaly for edge case when there was an issue with the code bellow
    // allow the user leave the component safely
    try {
      if (this.hasChangesDone() || this.updateStockTableComponent.hasChangesDone()) {
        let dialogRef = this.dialog.open(CustomDialog);
        dialogRef.afterClosed().subscribe(shouldSave => {
          if (shouldSave == 'true')
            this.saveChanges();
        })
      }
    } finally { }
  }
}


