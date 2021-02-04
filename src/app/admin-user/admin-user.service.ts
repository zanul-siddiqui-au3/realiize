import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {throwError as observableThrowError,  Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  BASE_URL = `/api/admin/user`;
  constructor(private http: HttpClient) { }

  getAllUsers = ({page , limit , searchValue})=>{
    let params = new HttpParams().set('page' , page).set('limit' , limit).set('searchValue' , searchValue)
    return this.http.get(`${this.BASE_URL}` , {params}).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }

  getOne = (userId)=>{
    return this.http.get(`${this.BASE_URL}/${userId}`).pipe(
      map((res: any) => res),
      catchError((error: any) => observableThrowError(error.error || 'Server error')),);
  }


}
