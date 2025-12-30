import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import { PostService, Shop } from '../../shared/services/post.service';
import { AuthReloadService } from '../../shared/AuthReloadServise/AuthReloadService';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FormsModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  
  constructor(private service:PostService, private ReloadService :AuthReloadService){

  }
  ReloadSub!:Subscription;
  ngOnInit(): void {
    this.loadShop();
      this.ReloadSub= this.ReloadService.alert$.subscribe(
      (e)=>{
        this.loadShop();
      }
    )
  }
 shop: Shop = {
  id: 0,
  name: '',
  logo: null,
  location: null,
  gmail: '',
  subscription: 0,
  instagram: null,
  facebook: null,
  titkok: null,
  bog:null,
  tbc:null,
  receiver:null,
};

  
  loadShop(): void {
    this.service.getShopById().subscribe({
      next: (data: Shop) => {
        this.shop = data;
      },
    });
  }
  AppRoutes=AppRoutes;
  sidenavVisible:boolean = false;
  leftToright:boolean = false;
  openSidenav(){
    this.sidenavVisible =  true;
    this.leftToright = false;
  }
  hideSidenav(){
    this.leftToright = true;
    setTimeout(() => {
      this.sidenavVisible =  false;
    }, 500);
  }
}
