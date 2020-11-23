import { Component, ViewChild } from "@angular/core";
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { StockService } from 'src/app/services/stock.service';
// import { ItemData } from './item-data/item-data.component';
import { MatAccordion } from '@angular/material/expansion';
import { element } from 'protractor';
import { CustomersService } from 'src/app/services/customers.service';
import { GALLERY_CONF, GALLERY_IMAGE, NgxImageGalleryComponent } from 'ngx-image-gallery';
// import { data } from 'jquery';

@Component({
    selector: 'item-scheduling',
    styleUrls: ['item-scheduling.css'],
    templateUrl: 'item-scheduling.component.html'
})
export class ItemSchedulingComponent {
    // get reference to gallery component
    @ViewChild(NgxImageGalleryComponent) ngxImageGallery: NgxImageGalleryComponent;

    // gallery configuration
    conf: GALLERY_CONF = {
        imageOffset: '0px',
        showDeleteControl: false,
        showImageTitle: false,
    };
    // gallery images
    images: GALLERY_IMAGE[] = [{url:"https://picsum.photos/536/354"}];
    dataSource: any[];
    DocumentForPerson: any[];
    @ViewChild(MatAccordion) accordion: MatAccordion;
    items: any[] = null;
    itemsIds: any;
    itemsNames: any[];

    constructor(private _globalFunctionsService: GlobalFunctionsService,
        private _stockService: StockService,
        private _customerService: CustomersService) { }


    ngOnInit() {
        this._customerService.getBridalEventId().subscribe(bridalEventId => {
            let filterObj = {
                nameField: 'BridalEventId',
                Value: bridalEventId,
                Operator: "="
            }

            this._globalFunctionsService.getTableData('BridalEventItem', undefined, [filterObj]).subscribe(data => {
                this.dataSource = data[0];
                this.itemsNames = [];
                this.dataSource.forEach(element => {
                    this._stockService.getSingleStockItem(element.StockBridalItemId).subscribe(itemData => {
                        element['BridalTypeItem'] = itemData[0]['BridalTypeItem'];
                        element['BridalItem_Description'] = itemData[0]['BridalItem_Description'];
                        element['Mct'] = itemData[0]['Mct'];
                        element['Attachment'] = JSON.parse(itemData[0]['Attachment'])[0];
                        this.itemsNames.push(element.BridalTypeItem)
                    })
                });
                this.getItems(); // get types items from the server
            })

        })
    }

    getItems() {
        this._globalFunctionsService.getTableData('bridalTypeItem', 'Description').subscribe(data => {
            this.items = data[0];
            // add every item an 'icon' field for the footer
            this.items.forEach(element => {
                element['icon'] = this.itemsNames.includes(element.Description) ? "✓" : "✗";
            })
        })
    }

    getItemColor(item: any) {
        return item['icon'] == "✓" ? { color: '#178f19' } : { color: 'rgb(207, 11, 11)' };
    }

    openImagePreview(image) {
        if(!image){
            console.log('image is broken')
            return;
        }
        this.setImagesArrayContentToSelectedImage(image);
        this.openGallery();
    }

    setImagesArrayContentToSelectedImage(image: any) {
        this.images = [
            {
                url: image,
                altText: 'this-is-alt-text',
                title: 'this-is-title',
            }
        ];
    }

    // METHODS for the lightbox (images viewer)
    // open gallery
    openGallery(index: number = 0) {
        this.ngxImageGallery.open(index);
    }

    // close gallery
    closeGallery() {
        this.ngxImageGallery.close();
    }

    // set new active(visible) image in gallery
    newImage(index: number = 0) {
        this.ngxImageGallery.setActiveImage(index);
    }

    // next image in gallery
    nextImage(index: number = 0) {
        this.ngxImageGallery.next();
    }

    // prev image in gallery
    prevImage(index: number = 0) {
        this.ngxImageGallery.prev();
    }

    /**************************************************/

    // EVENTS
    // callback on gallery opened
    galleryOpened(index) {
        console.info('Gallery opened at index ', index);
    }

    // callback on gallery closed
    galleryClosed() {
        console.info('Gallery closed.');
    }

    // callback on gallery image clicked
    galleryImageClicked(index) {
        console.info('Gallery image clicked with index ', index);
    }

    // callback on gallery image changed
    galleryImageChanged(index) {
        console.info('Gallery image changed to index ', index);
    }

    // callback on user clicked delete button
    deleteImage(index) {
        console.info('Delete image at index ', index);
    }
    getFormatedArray(image) {
        return [{
            url: image
        }]
    }
}


