import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStock } from '../interfaces/stock';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class StockService {

    private _url = 'http://82.166.33.42:8080//newYadEliezer/trunk/PHP/PHPTablet/PHPBridalSalon.php'
    private params = { "TypeFunction": "loadStockBridalItem" };
    private headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) { }

    getStock(): Observable<IStock[]> {
        return this.http.post<IStock[]>(this._url, "object=" + JSON.stringify(this.params), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
    }

    getSingleStockItem(itemId: string): Observable<IStock> {
        let params = { "TypeFunction": "loadStockBridalItem", "StockBridalItemId": itemId };
        return this.http.post<IStock>(this._url, "object=" + JSON.stringify(params), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
    }

    getItemFixes(itemId: string): Observable<IStock> {
        let params = { "TypeFunction": "AllSeamStressListByStockBridalItemId", "StockBridalItemId": itemId };
        return this.http.post<IStock>(this._url, "object=" + JSON.stringify(params), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
    }

    getItemEvens(itemId: string): Observable<IStock> {
        let params = { "TypeFunction": "getAllBridalEventByStockBridalItemId", "StockBridalItemId": itemId };
        return this.http.post<IStock>(this._url, "object=" + JSON.stringify(params), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
    }

    getItemCRM(itemId: string): Observable<IStock> {
        let params = { "TypeFunction": "getAllCRMByStockBridalItemId", "StockBridalItemId": itemId };
        return this.http.post<IStock>(this._url, "object=" + JSON.stringify(params), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
    }
}
