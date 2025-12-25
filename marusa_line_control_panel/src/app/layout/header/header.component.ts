import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import { PostService, Shop } from '../../shared/services/post.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FormsModule, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  
  constructor(private service:PostService){

  }
  
  ngOnInit(): void {
    this.loadShop(1);
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
  titkok: null
};

  
  loadShop(shopId: number): void {
    this.service.getShopById(shopId).subscribe({
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
