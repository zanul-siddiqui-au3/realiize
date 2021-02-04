
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse,  HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { environment } from './../../../environments/environment';
import { Test } from './../../../../shared/models/Test' ;


const API_URL = `${environment.apiUrl}/test/`;


@Injectable()
export class TestService {
    constructor(private http: HttpClient) { }

    public getAll(query:{}): Observable<Test[]> {
      var params = new HttpParams();
      if (query["page"]){
        params = params.append('page', query["page"]);
      };
      if (query["pageSize"]){
        params = params.append('pageSize', query["pageSize"]);
      };
        params = params.append('searchValue', query["searchValue"]);
        return this.http
            .get(API_URL,  { params: params })
            .map((response: any) => response.data)
            .catch(this.handleError);
    }
    public getOne(documentId: string): Observable<Test[]> {
        return this.http
            .get(`${API_URL}${documentId}`)
            .map((response: any) => response.data)
            .catch(this.handleError);
    }
    public update(test: Test): Observable<Test> {
        return this.http
            .put(`${API_URL}${test._id}`, { update: test })
            .map((response: any) => response.data)
            .catch(this.handleError);
    }
    public create(test: Test): Observable<Test> {
        return this.http
            .post(API_URL, { document : test })
            .map((response: any) => response.data)
            .catch(this.handleError);
    }
    public delete(_id: string) {
        const url = `${API_URL}${_id}`;
        return this.http
            .delete(url)
            .catch(this.handleError);
    }
    private handleError(error: Response | any) {
        console.error('testService::handleError', error);
        return Observable.throw(error);
    }
}
