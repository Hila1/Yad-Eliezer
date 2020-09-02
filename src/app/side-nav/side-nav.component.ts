import { Component } from '@angular/core';

/**
 * @title Autosize sidenav
 */
@Component({
  selector: 'side-nav',
  templateUrl: 'side-nav.component.html',
  styleUrls: ['side-nav.css'],
})
export class Sidenav {
  showFiller = false;

  goToTop() {
    // var element = document.getElementById("toolbar");
    // element.scrollIntoView({behavior: "smooth"});
    // var scrollToTop = window.setInterval(function () {
    //   var pos = window.pageYOffset;
    //   if (pos > 0) {
    //     window.scrollTo(0, pos - 20); // how far to scroll on each step
    //   } else {
    //     window.clearInterval(scrollToTop);
    //   }
    // }, 16); // how fast to scroll (this equals roughly 60 fps)
    // window.scrollTo(0,0);
    document.getElementById('top').scrollIntoView();
  }
}