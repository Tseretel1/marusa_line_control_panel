import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { StringToken } from '@angular/compiler';
import { AuthReloadService } from '../../shared/AuthReloadServise/AuthReloadService';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
@Component({
  selector: 'app-authorization',
  imports: [FormsModule],
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
}

export interface Auth{
  gmail:string;
  password:string;
}
