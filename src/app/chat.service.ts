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

const API_URL = `${environment.apiUrl}chat`;

@Injectable()
export class ChatService {
  constructor(private http: HttpClient) {}

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

  public update(chat: any): Observable<any> {
    return this.http
      .put(`${API_URL}/${chat._id}`, { update: chat })
      .pipe(catchError(this.handleError));
  }

  public create(chat: any) {
    return this.http.post(API_URL, { chat }).pipe(catchError(this.handleError));
  }

  public delete(_id: string) {
    const url = `${API_URL}${_id}`;
    return this.http.delete(url).pipe(catchError(this.handleError));
  }

  private handleError = (error: Response | any) => {
    console.error('ChatService::handleError', error);
    return observableThrowError(error);
  };

  public listOfUser() {
    const url = `${API_URL}/listOfUser`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  public getUserConversation(from, to): Observable<any> {
    const url = `${API_URL}/getUserConversation`;
    return this.http.post(url, { from, to }).pipe(catchError(this.handleError));
  }
}
