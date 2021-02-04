import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';

import { environment } from './../environments/environment';

const API_URL = `${environment.apiUrl}review`;

@Injectable()
export class ReviewService {
  constructor(private http: HttpClient) { }

  public getAll(data?: any): Observable<any> {
    return this.http
      .get(API_URL, { params: data })
      .pipe(catchError(this.handleError));
  }

  public getOne(documentId: string): Observable<any> {
    return this.http
      .get(`${API_URL}/${documentId}`)
      .pipe(catchError(this.handleError));
  }

  public update(review: any): Observable<any> {
    return this.http
      .put(`${API_URL}/${review._id}`, { update: review })
      .pipe(catchError(this.handleError));
  }

  public create(review: any) {
    return this.http
      .post(API_URL, { review })
      .pipe(catchError(this.handleError));
  }

  public delete(_id: string) {
    const url = `${API_URL}${_id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  private handleError = (error: Response | any) => {
    console.error('ReviewService::handleError', error);
    return observableThrowError(error);
  };
}
