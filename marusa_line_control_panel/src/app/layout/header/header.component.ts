import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterLink,FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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
