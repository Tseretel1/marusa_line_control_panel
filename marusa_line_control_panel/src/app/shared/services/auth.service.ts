import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../../pages/authorization/authorization.component';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient)
  {
  }
  Login(obj: Auth): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/login-to-shop`, {
      email: obj.gmail,
      password: obj.password,
    });
  }
  SendPasswordResetOtp(gmail: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/forgot-password/send-otp`, {
      gmail: gmail,
    });
  }
  VerifyPasswordResetOtp(gmail: string, otpCode: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/forgot-password/verify-otp`, {
      gmail: gmail,
      otpCode: otpCode,
    });
  }
  ResetPassword(gmail: string, otpCode: string, newPassword: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/forgot-password/reset-password`, {
      gmail: gmail,
      otpCode: otpCode,
      newPassword: newPassword,
    });
  }
  forceLogout(){
      localStorage.removeItem('user');
      localStorage.removeItem('token');
   }
}

 