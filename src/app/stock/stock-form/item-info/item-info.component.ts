import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { StockService } from 'src/app/services/stock.service';
import { MatAccordion } from '@angular/material/expansion';
import { DressesService } from 'src/app/services/dresses.service';

@Component({
  selector: 'item-info',
  templateUrl: 'item-info.component.html',
  styleUrls: ['item-info.css'],
})
export class ItemInfoComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  dataSource = null
  showSpinner = false;
  panelOpenState = false;
  imageIndex = 0;
  imagesArray = null;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _dressService: DressesService
  ) { }

  ngOnInit() {
    // get id from router params and use it to get the rest of the data
    this.route.paramMap.subscribe((params: ParamMap) => {
      this._dressService.getSingleDress(params.get("id")).subscribe(data => {
        this.dataSource = data[0];
        this.initImagesSource();
        console.log(this.dataSource)
      })
    })
  }

  initImagesSource() {
    this.imagesArray = JSON.parse(this.dataSource['Attachment']);
    // if the array is not empty and its first image has a source
    if (this.imagesArray != null && this.imagesArray[0]['src'] != null) {
      this.imagesArray = this.imagesArray.filter(i => i['src'] !== null) // remove items without src
        .sort((obj1, obj2) => obj1["viewFirst"] ? 1 : -1); // sort the images
    } else
      this.imagesArray = null; // make null for ui
  }


  nextImage() {
    this.imageIndex = (this.imageIndex + 1) % (this.imagesArray.length);
  }
  prevImage() {
    this.imageIndex = (this.imageIndex - 1) < 0 ? this.imagesArray.length - 1 : this.imageIndex - 1
  }
}