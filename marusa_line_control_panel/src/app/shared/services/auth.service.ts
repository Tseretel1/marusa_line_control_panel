import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../../pages/authorization/authorization.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://192.1.11.168:7174/';
  constructor(private http:HttpClient)
  {
  }
  Login(obj: Auth): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/login`, obj);
  }
}

 