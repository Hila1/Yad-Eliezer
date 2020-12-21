import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, RoutingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { DressesComponent } from './dresses/dresses.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { DressesService } from './services/dresses.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { ButtonToggle } from './button-toggle/button-toggle.component';
import { Sidenav } from './side-nav/side-nav.component';
import { StockService } from './services/stock.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdateStockTableComponent } from './dresses/dress-form/update-stock-table/update-stock-table.component'
import { GlobalFunctionsService } from './services/global-functions.service';
import { DressDetailsComponent } from './stock/stock-form/dress-detils/dress-details.component';
import { FixesComponent } from './stock/stock-form/fixes/fixes.component';
import { SaveService } from './services/save.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomDialog } from './ui/custom-dialog';
import { DataListPlusInputComponent } from './utils/data-list-plus-input/data-list-plus-input.component';
import { DetailsCardComponent } from './stock/stock-form/details-card/details-card.component';
import { EventsComponent } from './stock/stock-form/events/events.component';
import { CRMComponent } from './stock/stock-form/crm/crm.component';
import { MatAnimatedIconComponent } from './ui/animated-icon/animated-icon.component';
import { ItemInfoComponent } from './stock/stock-form/item-info/item-info.component';
import { CustomersService } from './services/customers.service';
import { CustomersFormComponent } from './customers/customers-form/customers-form.compnent';
import { ScrollTopComponent } from './ui/scroll-top/scroll-top.component';
import { FileDetailsComponent } from './customers/customers-form/file-details/file-details.component';
import { CustomersFormFixesComponent } from './customers/customers-form/fixes/customers-form-fixes';
import { RoomScheduling } from './customers/customers-form/rooms-scheduling/room-scheduling.component';
import { ItemSchedulingComponent } from './customers/customers-form/items-scheduling/item-scheduling.component';
import { ItemData } from './customers/customers-form/items-scheduling/item-data/item-data.component';
import { PaymentsComponent } from './customers/customers-form/payments/payments.component';
import { FixesItemComponent } from './customers/customers-form/fixes/fixes-item/fixes-item.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarService } from './services/calendar.service';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DemoUtilsModule } from './demo-utils/model';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { GalleryComponent } from './dresses/gallery-view/gallery-view.component';
import localeHe from '@angular/common/locales/he';
import { DatePipe, registerLocaleData } from '@angular/common';
import { ChipsComponent } from './calendar/chips/chips.component';
import { DemoMaterialModule } from './material-module';
import { StepperComponent } from './customers/customers-form/rooms-scheduling/stepper/stepper.component';


registerLocaleData(localeHe);

@NgModule({
  declarations: [
    AppComponent,
    DressesComponent,
    LoadingSpinnerComponent,
    ButtonToggle,
    Sidenav,
    RoutingComponent,
    UpdateStockTableComponent,
    DressDetailsComponent,
    FixesComponent,
    CustomDialog,
    DataListPlusInputComponent,
    DetailsCardComponent,
    EventsComponent,
    CRMComponent,
    MatAnimatedIconComponent,
    ItemInfoComponent,
    CustomersFormComponent,
    ScrollTopComponent,
    FileDetailsComponent,
    CustomersFormFixesComponent,
    RoomScheduling,
    ItemSchedulingComponent,
    ItemData,
    PaymentsComponent,
    FixesItemComponent,
    CalendarComponent,
    GalleryComponent,
    ChipsComponent,
    StepperComponent,
  ],
  imports: [
    NgxImageGalleryModule,
    DemoUtilsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    HttpClientJsonpModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModule,
    DemoMaterialModule,
  ],
  entryComponents: [CustomDialog],
  providers: [DressesService, StockService, GlobalFunctionsService, SaveService, CustomersService, CalendarService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }