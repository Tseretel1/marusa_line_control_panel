import { Component, HostListener, OnInit } from '@angular/core';
import { GetOrderDto, GetPost, OrderProduct, PostService, StartEndDate } from '../../shared/services/post.service';
import { CommonModule, DatePipe } from '@angular/common';
import { PhotoAlbumComponent } from "../../shared/components/photo-album/photo-album.component";
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import { dateTimestampProvider } from 'rxjs/internal/scheduler/dateTimestampProvider';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit{
  ngOnInit(): void {
    this.getOrdersLocalstorage();
    this.getOrderStatuses();
    this.getDashboardStats();
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
    localStorage.setItem('PageNumber', this.selectedPage.toString());
    this.scrollTotop();
    this.getOrdersLocalstorage();
  }
 
  totalPages:number =0;
  getOrders(){
    const pageNum= localStorage.getItem('PageNumber');
    if(pageNum){
      this.selectedPage = Number(pageNum);
      this.getOrderDto.PageNumber = Number(pageNum); 
    }
    this.service.getUserOrders(this.getOrderDto).subscribe(
      (resp)=>{
        if(resp==null){
          localStorage.setItem('PageNumber','1');
          this.getPaidOrUnpaidOrders(false);
          return;
        }
        this.orders = resp.orders;
        this.totalCount = resp.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.getOrderDto.PageSize);
        this.lastPage = Math.ceil(this.totalCount / this.getOrderDto.PageSize);
      }
    )
  }


  getOrdersLocalstorage(){
    const ispaid = localStorage.getItem('orderIdPaid');
    if(ispaid =='true'){
      localStorage.removeItem('PageNumber')
      this.getPaidOrUnpaidOrders(true);
      return;
    }
    this.getPaidOrUnpaidOrders(false);
    return;
  }


  getPaidOrUnpaidOrders(IsPaid:boolean){
    this.getOrderDto.OrderId = null;
    if(IsPaid){
      localStorage.setItem('orderIdPaid', 'true');
      this.getOrderDto.IsPaid = true;
      this.getOrders();
      return
    }
    else{
      localStorage.setItem('orderIdPaid', 'false');
      this.getOrderDto.IsPaid = false;
      this.getOrders();
    }
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

 getTimeAgo(dateString: string): string {
  const inputDate = new Date(dateString);
  const now = new Date();

  const diffInMs = now.getTime() - inputDate.getTime();
  if (diffInMs < 0) {
    const diffFuture = Math.abs(diffInMs);
    const days = Math.floor(diffFuture / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffFuture / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffFuture / (1000 * 60)) % 60);

    if (days > 0) return `${days} დღის${days > 1 ? 's' : ''} from now`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} from now`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} from now`;
    return 'Just now';
  }

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);

  if (days > 0) {
    return `${days} დღის${days > 1 ? '' : ''} ${hours} საათის${hours !== 1 ? '' : ''} წინ`;
  } else if (hours > 0) {
    return `${hours} საათის${hours > 1 ? '' : ''} ${minutes} წუთის${minutes !== 1 ? '' : ''} წინ`;
  } else if (minutes > 0) {
    return `${minutes} წუთის${minutes > 1 ? '' : ''} წინ`;
  } else {
    return 'ახლახანს';
  }

  


}


isOlderThan7Days(dateString: string | Date): boolean {
  const inputDate = new Date(dateString);
  const today = new Date();
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInMs = today.getTime() - inputDate.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays >= 7;
}

 scrollTotop(){
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  startDate:string= '2025-11-01';
  endDate: string = new Date().toISOString().split('T')[0];

  dashboardStats:Dashboard={
    totalPaidAmount : 0,
    totalUnPaidAmount : 0,
    paidOrdersCount:0,
    unpaidOrdersCount:0,
  }
  getDashboardStats(){
    const dashboard:StartEndDate={
      startDate :this.startDate,
      EndDate :this.endDate,
    }
    this.service.GetDahsboardStatistics(dashboard).subscribe(
      (resp)=>{
        this.dashboardStats = resp.statistics;
        console.log(resp)
      }
    )
  }
  openDatePicker(input: HTMLInputElement) {
    input.showPicker?.();
    input.click();          
  }

}
export interface orderStatuses{
 id:number;
 statusName:string;
}


export interface Dashboard{
  totalPaidAmount:number;
  totalUnPaidAmount:number;
  paidOrdersCount:number;
  unpaidOrdersCount:number;
}