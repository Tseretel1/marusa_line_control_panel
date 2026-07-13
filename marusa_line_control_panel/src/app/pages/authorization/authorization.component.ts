import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { StringToken } from '@angular/compiler';
import { AuthReloadService } from '../../shared/AuthReloadServise/AuthReloadService';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
@Component({
  selector: 'app-authorization',
  imports: [FormsModule, CommonModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})
export class AuthorizationComponent {
    constructor(private AuthReloadService:AuthReloadService,private authService:AuthService, private router:Router){

  }

  
  gmail:string='';
  password:string='';
  Authorize(){
    if (this.gmail === '' || this.password === '') {
      return;
    }
    const user :Auth={
      gmail : this.gmail,
      password :this.password
    };
    this.authService.Login(user).subscribe({
      next: (resp)=>{
        if(resp.succeeded){
          localStorage.setItem('token',resp.token);
          this.router.navigate([AppRoutes.posts])

          this.AuthReloadService.reafresh();
        }
        else{
          Swal.fire({
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'იმეილი ან პაროლი არასწორია',
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: 'green',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          title:'იმეილი ან პაროლი არასწორია',
        });
      }
    })
  }

  forgotPasswordVisible: boolean = false;
  fpStep: number = 1;
  fpGmail: string = '';
  fpOtpCode: string = '';
  fpNewPassword: string = '';
  fpResendCooldown: number = 0;
  private fpResendTimer: any;

  openForgotPassword() {
    this.forgotPasswordVisible = true;
    this.fpStep = 1;
    this.fpGmail = this.gmail;
    this.fpOtpCode = '';
    this.fpNewPassword = '';
  }

  closeForgotPassword() {
    this.forgotPasswordVisible = false;
    clearInterval(this.fpResendTimer);
    this.fpResendCooldown = 0;
  }

  private startResendCooldown() {
    this.fpResendCooldown = 60;
    clearInterval(this.fpResendTimer);
    this.fpResendTimer = setInterval(() => {
      this.fpResendCooldown--;
      if (this.fpResendCooldown <= 0) {
        clearInterval(this.fpResendTimer);
      }
    }, 1000);
  }

  sendOtp() {
    if (this.fpGmail === '') {
      return;
    }
    this.authService.SendPasswordResetOtp(this.fpGmail).subscribe({
      next: (resp) => {
        if (resp.succeeded) {
          this.fpStep = 2;
          this.startResendCooldown();
        } else {
          Swal.fire({
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'კოდის გაგზავნა ვერ მოხერხდა',
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: 'green',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          title:'კოდის გაგზავნა ვერ მოხერხდა',
        });
      }
    });
  }

  verifyOtp() {
    if (this.fpOtpCode === '') {
      return;
    }
    this.authService.VerifyPasswordResetOtp(this.fpGmail, this.fpOtpCode).subscribe({
      next: (resp) => {
        if (resp.succeeded) {
          this.fpStep = 3;
        } else {
          Swal.fire({
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'კოდი არასწორია ან ვადაგასულია',
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: 'green',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          title:'კოდი არასწორია ან ვადაგასულია',
        });
      }
    });
  }

  submitNewPassword() {
    if (this.fpNewPassword.length <= 6) {
      Swal.fire({
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
        confirmButtonColor: 'green',
        background:'rgb(25, 26, 25)',
        color: '#ffffff',
        title:'პაროლი უნდა შეიცავდეს 6-ზე მეტ სიმბოლოს',
      });
      return;
    }
    this.authService.ResetPassword(this.fpGmail, this.fpOtpCode, this.fpNewPassword).subscribe({
      next: (resp) => {
        if (resp.succeeded) {
          this.signInAfterReset();
        } else {
          Swal.fire({
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'პაროლის შეცვლა ვერ მოხერხდა',
          });
        }
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: 'green',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          title:'პაროლის შეცვლა ვერ მოხერხდა',
        });
      }
    });
  }

  private signInAfterReset() {
    const user: Auth = {
      gmail: this.fpGmail,
      password: this.fpNewPassword
    };
    this.authService.Login(user).subscribe({
      next: (resp) => {
        if (resp.succeeded) {
          localStorage.setItem('token', resp.token);
          this.closeForgotPassword();
          Swal.fire({
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'პაროლი წარმატებით შეიცვალა',
          });
          this.router.navigate([AppRoutes.posts]);
          this.AuthReloadService.reafresh();
        } else {
          this.closeForgotPassword();
          Swal.fire({
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'პაროლი წარმატებით შეიცვალა, გთხოვთ შეხვიდეთ სისტემაში',
          });
        }
      },
      error: () => {
        this.closeForgotPassword();
        Swal.fire({
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: 'green',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          title:'პაროლი წარმატებით შეიცვალა, გთხოვთ შეხვიდეთ სისტემაში',
        });
      }
    });
  }
}

export interface Auth{
  gmail:string;
  password:string;
}
