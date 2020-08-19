import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class SaveService {

    private _url = 'http://82.166.33.42:8080//newYadEliezer/trunk/PHP/PHPTablet/phpUtilsFunction.php'
    private headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    private options = { headers: this.headers };

    constructor(private http: HttpClient) { }

    getEmptyObject(tableName: string): Observable<any[]> {
        return this.http.post<any>(this._url, "objectUtil=" + JSON.stringify(
            { Object: { 'TableName': tableName, 'Flag': 0 }, Action: 'Save' }), this.options)
    }

    saveData(tmp: any, tableName: string) : Observable<any[]> {
        // הפונקציה מחזירה מערך של המזהים החדשים
        var save = this.save(null, [tmp], tableName);
        return this.http.post<any>(this._url, "objectUtil=" + JSON.stringify({ Object: save, Action: 'Save' }),
            this.options);
    }

    save(orginal,object,NameTabel){ 
        var unitValueList=[]; 
        var objectTable={"tableName":NameTabel,"unitField":NameTabel+"Id","unitValueList":unitValueList};
        
        for (var i = 0; i < object.length ; i++) {
            if(object[i]){//יש פעמים שנשלח לפונקציה זו אובייקט שאין לו ערך מקרה זה קורה כאשר מפעילים שמירה שך דף אבל עדין לא נוצר אובייקט
    
                //מאפסים מערך שדות לעידכון בעבור כל רשומה
                var FieldList=[];
                //יוצרים אובייקט רשומה המכיל קוד רשומה ומערך שדות לעידכון
                if(object[i][NameTabel+"Id"]!=='$'){
                    var objF;
                    if(object[i][NameTabel+"Id"])    {            
                        objF={"unitValue":object[i][NameTabel+"Id"],"FieldList":FieldList,"state":"EDIT"};                
                    }
                    else{
               
                        object[i][NameTabel+"Id"]='-1';
                        objF={"FieldList":FieldList,"state":"INSERT","unitValue":'-1'};
                    }                   
                    for (var item in object[i]){
                       
                       
                          
                        //אם מדובר בתאריך יש להמיר אותו לפורמט שנה חודש יום בכדי לאפשר שמירה נכונה במסד הנתונים
                        if(object[i][item]&& typeof object[i][item].getMonth === 'function'){
                            object[i][item]=this.getOnlyDate(object[i][item]);
                            if(orginal && orginal[i])
                                orginal[i][item]=this.getOnlyDate(orginal[i][item]);
                        }
                        //אם זה מערך  או אובייקט בוודאי אין מה לשמור 
                        else if(object[i][item] && typeof(object[i][item])=='object')
                              continue;
                              if(item == NameTabel+"Id") continue;
                        if(!orginal || i>=orginal.length || orginal[i][item]!=object[i][item] )//נעשה שינוי 
                            if(item.localeCompare('ProjectId')!=0 && item.indexOf("$")==-1 && ((orginal && orginal[i] &&  orginal[i].hasOwnProperty([item])) || (!orginal || !orginal[i])))
                                FieldList.push({"nameField":item,"newValue":object[i][item]==null || object[i][item]==undefined ?null :object[i][item] });
                    
                   
                    }
                    //קיים באוביקט שדות לעידכון ויש פרויקט באוביקט
                    //או שמדובר רק בעידכון של שדה פרויקט והוא קיים באובייקט האורגינאלי אך שונה
                    if((FieldList.length && object[i].hasOwnProperty('ProjectId'))|| (orginal && orginal.length>0 && i<orginal.length && orginal[i]['ProjectId']!=object[i]['ProjectId']))
                        FieldList.push({"nameField":'ProjectId',"newValue":object[i]['ProjectId']});
                        
                   
                    
                }       
                FieldList.length?unitValueList.push(objF):null;            
            }
        }
        return objectTable.unitValueList.length?objectTable:null;    
    };

    getOnlyDate(d, format_d = null) {
        if (format_d && 
            //אין השוואה גם לפורמט של חודש יום שנה כי זה מה שהפונקציה הזאת עושה
            format_d == 'dd-mm-yy' || format_d == 'yyyy-mm-dd')
                d = this.getOnlyDateByFormat_mm_dd_yyy(d);
        
        let today = new Date(d);

        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        let day, month;
        if (dd < 10) { day = '0' + dd; }
        else { day = dd.toString }

        if (mm < 10) { month = '0' + mm; }
        else { month = mm.toString }

        return yyyy + '-' + month + '-' + day;
    }

    getOnlyDateByFormat_mm_dd_yyy(d, format = null): any {
        if (!format) { format = '/'; }

        let today = new Date(d);
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        let day, month;
        if (dd < 10) { day = '0' + dd; }
        else { day = dd.toString }

        if (mm < 10) { month = '0' + mm; }
        else { month = mm.toString }

        return day + format + month + format + yyyy;
    }
}
