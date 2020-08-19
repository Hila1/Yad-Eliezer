import { Component } from '@angular/core';

@Component({
    selector: 'dialog-elements-example-dialog',
    template: `
    <h1 mat-dialog-title>שינויים שלא נשמרו</h1>
    <div mat-dialog-content>עשית שינויים שלא נשמרו. האם תרצה לשמור עכשיו?</div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close mat-dialog-close='true'>כן, שמור</button>
      <button mat-button mat-dialog-close mat-dialog-close='false'>לא, אין צורך</button>
    </div>
    `,
  })
  export class CustomDialog { }