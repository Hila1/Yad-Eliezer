import { Component, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router'
import { DressesService } from '../services/dresses.service';

@Component({
  selector: 'dresses-table',
  styleUrls: ['dresses-table.css'],
  templateUrl: 'dresses-table.component.html',
})
export class DressesComponent implements OnInit {
  displayedColumns: string[] = ['BridalItemId', 'Description', 'BridalTypeItem', 'Color', 'Style'];
  dataSource: any = [];
  errorMsg: any;
  showSpinner: boolean = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private _dressesService: DressesService,
    private router: Router,
    private route: ActivatedRoute) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.showSpinner = true;
    this._dressesService.getDresses().subscribe(data => {
      this.dataSource = data;
      this.removeUnneededData();
      this.dataSource = new MatTableDataSource(this.dataSource);

      this.dataSource.sort = this.sort;
      this.showSpinner = false;
    });
  }


  /**
   *  This function removes from data source all the keys which are not in the displayed columns
   *  to make sure the filtering wouldnt be mixed with unneeded columns 
   */
  removeUnneededData() {
    this.dataSource.forEach(element => {
      for (let key in element) {
        if (this.displayedColumns.indexOf(key) <= -1) { delete element[key]; }
      }
    });
  }
  addNewItem() {
    this.router.navigate(['/dresses/dress-form', { id: -1 }]);

  }

  rowClicked(element: any) {
    this.router.navigate(['/dresses/dress-form', { id: element.BridalItemId }]);
    // this.router.navigate([element.BridalItemId], { relativeTo: this.route })
  }
}
