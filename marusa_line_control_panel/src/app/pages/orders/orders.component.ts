import { Component, HostListener, OnInit } from '@angular/core';
import { GetOrderDto, GetPost, OrderProduct, PostService } from '../../shared/services/post.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PhotoAlbumComponent } from "../../shared/components/photo-album/photo-album.component";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule,DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
  ngOnInit(): void {
    this.getOrders();
    
  }

  constructor(private service: PostService){

  }

  orders:OrderProduct []=[]
  getOrderDto:GetOrderDto={
    IsPaid : false,
    OrderId : null,
    PageNumber : 1,
    PageSize : 20,
  }


  getOrders(){
    this.service.getUserOrders(this.getOrderDto).subscribe(
      (resp)=>{
        if(resp==null){
          this.getPaidOrUnpaidOrders(false);
          return;
        }
        this.orders = resp;
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

  orderSearchNum :number = 0;
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
}