import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsertPost } from '../../pages/edit-post/edit-post.component';
import { UntypedFormBuilder } from '@angular/forms';
import { orderStatuses } from '../../pages/orders/order-details/order-details.component';
import { innerFrom } from 'rxjs/internal/observable/innerFrom';
import { Auth } from '../../pages/authorization/authorization.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://192.168.1.14:7174/';
  constructor(private http:HttpClient)
  {

  }

  Login(obj: Auth): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/login`, obj);
  }
}

