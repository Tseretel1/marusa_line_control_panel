import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { LoaderComponent } from "./shared/components/loader/loader.component";
import { AuthorizationComponent } from "./pages/authorization/authorization.component";
import { CommonModule } from '@angular/common';
import { Token } from '@angular/compiler';
import { Subscription } from 'rxjs';
import { AuthReloadService } from './shared/AuthReloadServise/AuthReloadService';
import { AppRoutes } from './shared/AppRoutes/AppRoutes';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, LoaderComponent, AuthorizationComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  AppRoutes = AppRoutes;
  title = 'marusa_line_control_panel';
  constructor(private AuthReloadService:AuthReloadService, private router: Router){

  }
  
  reloadSubscription!: Subscription;
  ngOnInit(): void {
    this.reloadSubscription = this.AuthReloadService.alert$.subscribe(
    (show)=>{
      if(show){
        this.checkIfAuthorized();
      }
    })
    this.checkIfAuthorized();
  }
  
  Authorised:boolean = false;
  checkIfAuthorized(){
    const GetToken = localStorage.getItem('token');
    if(GetToken){
      this.Authorised = true;
      return;
    }
    else{
      this.Authorised = false;
      return;
    }
  }
}
