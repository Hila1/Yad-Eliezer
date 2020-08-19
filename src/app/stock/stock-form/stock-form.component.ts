import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GlobalFunctionsService } from 'src/app/services/global-functions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { StockService } from 'src/app/services/stock.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'stock-form',
  templateUrl: 'stock-form.component.html',
  styleUrls: ['stock-form.css'],
  encapsulation: ViewEncapsulation.None
})
export class StockFormComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  title = ['תיקונים', 'אירועים', 'CRM'];
  panelOpenState = false;

}