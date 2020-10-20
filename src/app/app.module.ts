import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, RoutingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { DressesComponent } from './dresses/dresses.component';
import { HttpClientModule } from '@angular/common/http';
import { DressesService } from './services/dresses.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { LoadingSpinnerComponent } from './ui/loading-spinner/loading-spinner.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { ButtonToggle } from './button-toggle/button-toggle.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Sidenav } from './side-nav/side-nav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { StockService } from './services/stock.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { UpdateStockTableComponent } from './dresses/dress-form/update-stock-table/update-stock-table.component'
import { GlobalFunctionsService } from './services/global-functions.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatTabsModule } from '@angular/material/tabs';
import { DressDetailsComponent } from './stock/stock-form/dress-detils/dress-details.component';
import { FixesComponent } from './stock/stock-form/fixes/fixes.component';
import { SaveService } from './services/save.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomDialog } from './ui/custom-dialog';
import { DataListPlusInputComponent } from './utils/data-list-plus-input/data-list-plus-input.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DetailsCardComponent } from './stock/stock-form/details-card/details-card.component';
import { EventsComponent } from './stock/stock-form/events/events.component';
import { CRMComponent } from './stock/stock-form/crm/crm.component';
import { MatListModule } from '@angular/material/list';
import { MatAnimatedIconComponent } from './ui/animated-icon/animated-icon.component';
import { ItemInfoComponent } from './stock/stock-form/item-info/item-info.component';
import { CustomersService } from './services/customers.service';
import { CustomersFormComponent } from './customers/customers-form/customers-form.compnent';
import { ScrollTopComponent } from './ui/scroll-top/scroll-top.component';
import { FileDetailsComponent } from './customers/customers-form/file-details/file-details.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CustomersFormFixesComponent } from './customers/customers-form/fixes/customers-form-fixes';
import { RoomScheduling } from './customers/customers-form/rooms-scheduling/room-scheduling.component';
import { ItemSchedulingComponent } from './customers/customers-form/items-scheduling/item-scheduling.component';
import { ItemData } from './customers/customers-form/items-scheduling/item-data/item-data.component';
import { PaymentsComponent } from './customers/customers-form/payments/payments.component';
import { FixesItemComponent } from './customers/customers-form/fixes/fixes-item/fixes-item.component';


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
    FixesItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatPaginatorModule,
    MatSortModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatListModule,
    MatCheckboxModule
  ],
  entryComponents: [CustomDialog],
  providers: [DressesService, StockService, GlobalFunctionsService, SaveService, CustomersService],
  bootstrap: [AppComponent]
})
export class AppModule { }