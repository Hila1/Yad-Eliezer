import { Component } from '@angular/core';

/**
 * @title Basic button-toggles
 */
@Component({
  selector: 'button-toggle',
  templateUrl: 'button-toggle.component.html',
  styleUrls: ['button-toggle.css'],
})
export class ButtonToggle {
  buttonsNames = [
    'customers',
    'dresses',
    'stock',
    'calendar'];
  currentName = "";

  ngOnInit() {
    this.currentName = this.getCurrentComponentName();
  }

  getCurrentComponentName() {
    let res = "customers"
    var urlWindow = document.URL;
    this.buttonsNames.forEach(buttonName => {
      if (urlWindow.indexOf(buttonName) > -1)
        res = buttonName;
    })
    return res;
  }
}