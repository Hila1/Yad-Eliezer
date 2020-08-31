import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'animated-icon',
  templateUrl: 'animated-icon.component.html',
  styleUrls: ['animated-icon.css']
})
export class MatAnimatedIconComponent implements OnInit {

  @Input() start: String;
  @Input() end: String;
  @Input() colorStart: String;
  @Input() colorEnd: String;
  @Input() animate: boolean;
  @Input() animateFromParent?: boolean = false;

  constructor() { }

  ngOnInit() {
    console.log(this.colorStart);
    console.log(this.colorEnd);
  }

  toggle() {
    if(!this.animateFromParent) this.animate = !this.animate;
  }

}