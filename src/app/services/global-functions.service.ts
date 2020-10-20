import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SaveService } from './save.service';


@Injectable()
export class GlobalFunctionsService {
    private _url = 'http://82.166.33.42:8080//newYadEliezer/trunk/NewPhp/API/phpUtilsFunction.php'
    private headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    private options = { headers: this.headers };

    constructor(private http: HttpClient, private saveService: SaveService) { }

    /**
     * This function returns data of a table (also known as a 'search / insert table')
     * @param tableName the name of the table from which the search will be made
     * @param orderBy optional, filed from the table to order by the the resulted items
     * @param filterObject optional, an object that contains field and value to filter the results by
     */
    getTableData(tableName: string, orderBy?: string, filterObject?: any): Observable<[any[]]> {
        var lists = [];
        // var field = [];
        // add the given filterObject to the list of fileds
        // field.push(filterObject);

        // final object to be send
        var objectOfVars = {};

        // if given, add order by to the final search object
        if (orderBy) { objectOfVars["orderBy"] = orderBy };
        // if given, add the filter object to the final search object
        if (filterObject) { objectOfVars["FieldList"] = filterObject }

        // add the rest of the values to the final object (they are always the same)
        objectOfVars["nameTable"] = tableName;
        objectOfVars["CompareType"] = "AND";
        objectOfVars["flag"] = 1

        // add the final object to the list
        lists.push(objectOfVars);

        // make http post request using the above varaibles
        return this.http.post<[any[]]>(this._url,
            "objectUtil=" + JSON.stringify({ Object: lists, Action: 'Search' }), this.options)
            .pipe(catchError(err => {
                debugger
                console.log(err);
                return Observable.throw(err);
            }))
    }

    /**
     * This function updates values of an object in the DB.
     * @param original the original object as it was before changing
     * @param active the object ofter the changes
     * @param tableName the name of the table from which the item should be updated in
     */
    update(original = null, active, tableName: string): Observable<any> {
        console.log("orginal, active, tableName:");
        console.log(original);
        console.log(active);
        console.log(tableName);

        var save = this.saveService.save(original ? [original] : null, [active], tableName);
        var headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
        var obj = "objectUtil=" + JSON.stringify({ Object: save, Action: 'Save' })

        return this.http.post<any>(this._url, obj, { headers, responseType: 'text' as 'json' })
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }));
    }

    /**
     * This function deletes an item form a table in the BD
     * @param tableName the name of the table to delete from
     * @param tableField the field from the table to delete by
     * @param value the value of the field in the object to delete
     */
    delete(tableName: string, tableField: string, value: string) {

        // object to add to the final object
        var objToAdd = {};
        objToAdd[tableField] = value;

        // final object using ti delete
        var objToDelete = { "nameTable": tableName, "ObjectCondition": objToAdd };
        console.log(objToDelete);

        this.http.post<any>(this._url, "objectUtil=" + JSON.stringify({
            Object: objToDelete, Action: 'Delete'
        }), this.options)
            .pipe(catchError(err => {
                console.log(err);
                return Observable.throw(err);
            }))
            .subscribe((data => {
                console.log(data);
            }))
    }

    getElementID() {
        let url = window.location.href;
        // remove sufix
        url = url.substring(0, url.lastIndexOf('/'));
        // remove prefix
        let id = url.substring(url.lastIndexOf('/') + 1);
        // in case there is no more slashes after the id - defferent formatting
        if(isNaN(+id)){
            url = window.location.href;
            id = url.substring(url.lastIndexOf('/') + 1);
        }
        return id;
    }

      /*
  * This function returns the header of the project's url
  */
  getUrlPage() {
    var urlWindow = document.URL;
    var urlStart = '';
    if (urlWindow.indexOf(":4200") != -1) {
      urlStart = 'http://82.166.33.42:8080//newYadEliezer/trunk';
    } else {
      var index = urlWindow.indexOf("trunk");
      urlStart = urlWindow.substring(0, index + 5);
    }
    return urlStart;
  }
}
