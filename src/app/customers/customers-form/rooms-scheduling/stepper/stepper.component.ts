import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * @title Stepper label bottom position
 */
@Component({
    selector: 'stepper',
    templateUrl: 'stepper.component.html',
    styleUrls: ['stepper.css'],
})
export class StepperComponent implements OnInit {
    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    viewDate: any;

    constructor(private _formBuilder: FormBuilder) { }

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            firstCtrl: ['', Validators.required]
        });
        this.secondFormGroup = this._formBuilder.group({
            secondCtrl: ['', Validators.required]
        });
    }
    setDate(date) {
        this.viewDate = date;
    }
}
