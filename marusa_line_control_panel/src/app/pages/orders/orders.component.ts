import { Component, HostListener, OnInit } from '@angular/core';
import { GetOrderDto, GetPost, OrderProduct, PostService } from '../../shared/services/post.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PhotoAlbumComponent } from "../../shared/components/photo-album/photo-album.component";
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
  ngOnInit(): void {
    this.getOrders();
    this.getOrderStatuses();
  }

  AppRoutes = AppRoutes;
  constructor(private service: PostService){

  }

  totalCount:number = 0;
  orders:OrderProduct []=[]
  getOrderDto:GetOrderDto={
    IsPaid : false,
    OrderId : null,
    PageNumber : 1,
    PageSize : 10,
  }



  lastPage: number = 0; 
  selectedPage: number = 1;
  pageNumber: number = 1;
  changePage(page: number) {
    if (page < 1 || page > this.lastPage) return;
    this.selectedPage = page;
    this.getOrderDto.PageNumber = page; 
    const middle = this.pageNumber + 2;
    if (page > middle) {
      this.pageNumber = page - 2;
    } else if (page < middle && this.pageNumber > 1) {
      this.pageNumber = Math.max(1, page - 2);
    }
    this.getOrders();
    localStorage.setItem('FeedbackPageNumber', this.selectedPage.toString());
  }


  getOrders(){
    this.service.getUserOrders(this.getOrderDto).subscribe(
      (resp)=>{
        console.log(resp)
        if(resp==null){
          this.getPaidOrUnpaidOrders(false);
          return;
        }
        this.orders = resp.orders;
        this.totalCount = resp.totalCount;
      }
    )
  }

  getPaidOrUnpaidOrders(IsPaid:boolean){
    this.getOrderDto.OrderId = null;
    if(IsPaid){
      this.getOrderDto.IsPaid = true;
      this.getOrders();
      return
    }
    this.getOrderDto.IsPaid = false;
    this.getOrders();
    return
  }

  orderSearchNum !:number;
  OrderSearch(){
    this.getOrderDto.OrderId = this.orderSearchNum;
    this.getOrders();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.OrderSearch();
    }
  }
  orderStatuses:orderStatuses[]= [];
  getOrderStatuses(){
    this.service.getOrderStatuses().subscribe(
      (resp)=>{
        this.orderStatuses = resp;
      }
    )
  }
  getStatusName(statusid:number){
    const name  = this.orderStatuses.find((x)=> x.id == statusid);
    return name?.statusName;
  }



}
export interface orderStatuses{
 id:number;
 statusName:string;
}