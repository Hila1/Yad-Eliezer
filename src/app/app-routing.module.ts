import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { DressesComponent } from './dresses/dresses.component';
import { CustomersComponent } from './customers/customers.component';
import { DressFormComponent } from './dresses/dress-form/dress-form.component';
import { StockFormComponent } from './stock/stock-form/stock-form.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full'},
  { path: 'stock', component: StockComponent },
  { path: 'stock/stock-form', component: StockFormComponent },
  { path: 'dresses', component: DressesComponent },
  { path: 'dresses/dress-form', component: DressFormComponent },
  { path: 'customers', component: CustomersComponent },
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
  PageNotFoundComponent];