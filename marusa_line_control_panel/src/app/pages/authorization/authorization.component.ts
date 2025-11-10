import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { StringToken } from '@angular/compiler';
import { AuthReloadService } from '../../shared/AuthReloadServise/AuthReloadService';
@Component({
  selector: 'app-authorization',
  imports: [FormsModule],
  templateUrl: './authorization.component.html',
  styleUrl: './authorization.component.scss'
})
export class AuthorizationComponent {
    constructor(private AuthReloadService:AuthReloadService,private authService:AuthService){

  }

  Authorize(){
    const user :Auth={
      username : this.username,
      password :this.password
    };
    this.authService.Login(user).subscribe(
      (resp)=>{
        if(resp.token!=null){
          localStorage.setItem('token',resp.token);
          this.AuthReloadService.reafresh();
        }
      }
      )
  }

  username:string='';
  password:string='';
}

export interface Auth{
  username:string;
  password:string;
}
