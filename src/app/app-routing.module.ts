import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { DressesComponent } from './dresses/dresses.component';
import { CustomersComponent } from './customers/customers.component';
import { DressFormComponent } from './dresses/dress-form/dress-form.component';
import { StockFormComponent } from './stock/stock-form/stock-form.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { FixesComponent } from './stock/stock-form/fixes/fixes.component';
import { EventsComponent } from './stock/stock-form/events/events.component';
import { CRMComponent } from './stock/stock-form/crm/crm.component';
import { CustomersFormComponent } from './customers/customers-form/customers-form.compnent';


const routes: Routes = [
  { path: '', redirectTo: '/dresses', pathMatch: 'full' },
  { path: 'stock', component: StockComponent },
  {
    path: 'stock/:id', component: StockFormComponent,
    children: [
      { path: 'fixes', component: FixesComponent },
      { path: 'events', component: EventsComponent },
      { path: 'crm', component: CRMComponent }
    ]
  },
  { path: 'dresses', component: DressesComponent },
  { path: 'dresses/:id', component: DressFormComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'customers/:id', component: CustomersFormComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const RoutingComponent = [StockComponent,
  StockFormComponent,
  DressesComponent,
  CustomersComponent,
  DressFormComponent,
  PageNotFoundComponent,
  FixesComponent,
  EventsComponent,
  CRMComponent];