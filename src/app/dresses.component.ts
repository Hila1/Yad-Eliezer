import { Component } from '@angular/core';
import { DressesService } from './dresses.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector:'dresses',
    template: `
    <h2>{{ title }}</h2>
    <h3>{{dresses}}</h3>
    <ul>
        <li *ngFor="let dress of dresses">
            {{ dress}}
        </li>
    </ul>
    `
})
export class DressesComponent{
    title = 'List of Dresses:';
    public dresses: any;

    constructor(private http: HttpClient,private _dressesService: DressesService) {}

    ngOnInit(){
        this._dressesService.getDresses()
        .subscribe(data => this.dresses = data);
    }
}