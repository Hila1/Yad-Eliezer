import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'stock-form',
  templateUrl: 'stock-form.component.html',
  styleUrls: ['stock-form.css'],
  encapsulation: ViewEncapsulation.None
})

export class StockFormComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  // title = ['תיקונים', 'אירועים', 'CRM'];
  panelOpenState = false;
  icon = ['chevron_left', 'chevron_right']
  index = 0
  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.navigateTo('fixes');
  }

  navigateTo(name: string) {
    this.router.navigate([name], { relativeTo: this.route })
  }
  toggleDrwer(drawer) {
    drawer.toggle();
    this.index = (this.index + 1) % 2
  }
}