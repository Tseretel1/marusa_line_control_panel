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
    this.generateMonthsList();
    this.setStats();
  }

  setStats(){
    this.generateYearsList();
    this.getDashboardStats();
  }
  AppRoutes = AppRoutes;
  constructor(private service: PostService){

  }

  totalCount:number = 0;
  orders:OrderProduct []=[]
  getOrderDto:GetOrderDto={
    UserId : null,
    IsPaid : false,
    OrderId : null,
    PageNumber : 1,
    PageSize : 25,
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
    this.getOrderDto.UserId = null
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
    this.getOrderDto.UserId  = null;
    this.getOrderDto.OrderId = this.orderSearchNum;
    this.getOrders();
  }
  UserIdSearch !:number;
  UserIdOrderSearch(){
    this.getOrderDto.OrderId = null;
    this.getOrderDto.UserId = this.UserIdSearch;
    this.getOrders();
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


isOlderThan1Day(dateString: string | Date): boolean {
  const inputDate = new Date(dateString);
  const today = new Date();
  const diffInMs = today.getTime() - inputDate.getTime();
  const diffInDays = diffInMs / 86400000;
  return diffInDays > 1;
}
isOlderThan7Day(dateString: string | Date): boolean {
  const inputDate = new Date(dateString);
  const today = new Date();
  const diffInMs = today.getTime() - inputDate.getTime();
  const day7 = 7 * 86400000;
  const diffInDays = diffInMs / day7;
  return diffInDays > 1;
}


 scrollTotop(){
     window.scrollTo({ top: 0, behavior: 'smooth' });
 }


  startDate:string= '';
  endDate: string = '';

  dashboardStats:Dashboard={
    totalPaidAmount : 0,
    totalUnPaidAmount : 0,
    paidOrdersCount:0,
    unpaidOrdersCount:0,
  }

dateBulilder() {
  const startMonthString = this.startMonthNum.toString().padStart(2, '0');
  const endMonthString = this.endMonthNum.toString().padStart(2, '0');
  this.startDate = `${this.currentYear}-${startMonthString}-01`;

  const currentMonth = new Date().getMonth() + 1; 

  if (this.endMonthNum === currentMonth) {
    const today = new Date().getDate().toString().padStart(2, '0');  
    this.endDate = `${this.currentYear}-${endMonthString}-${today}`;
  } else {
    const lastDay = new Date(this.currentYear, this.endMonthNum, 0)
      .getDate()
      .toString()
      .padStart(2, '0');  

    this.endDate = `${this.currentYear}-${endMonthString}-${lastDay}`;
  }
}


  getDashboardStats(){
    this.dateBulilder();
    const dashboard:StartEndDate={
      startDate :this.startDate,
      endDate :this.endDate,
    }
    console.log(dashboard)
    this.service.GetDahsboardStatistics(dashboard).subscribe(
      (resp)=>{
        this.dashboardStats = resp.statistics;
      }
    )
  }
  MonthsList: Months[] = [];
  generateMonthsList() {
    const names = [
      'იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი',
      'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი'
    ];
    names.forEach((element, index) => {
      const insertMonth: Months = {
        id: index + 1,
        MonthName: element,
      };
      this.MonthsList.push(insertMonth);
    });
  }

  startMonthNum:number = new Date().getMonth()+ 1;
  endMonthNum:number =new Date().getMonth() + 1;
  getStartMothName(): string | undefined {
    const found = this.MonthsList.find(m => m.id === this.startMonthNum);
    return found?.MonthName;
  }
  getEndMonthName(): string | undefined {
    const found = this.MonthsList.find(m => m.id === this.endMonthNum);
    return found?.MonthName;
  }
  thisLastDay:number = 0;
  getEndDay(){
    if (this.endMonthNum === new Date().getMonth()+1) {
      this.thisLastDay = new Date().getDate();
    } else {
      this.thisLastDay =new Date(this.currentYear, this.endMonthNum, 0).getDate(); 
    }
  }
  Years:number[]=[]
  currentYear:number = 0;
  generateYearsList() {
    const currentYear = new Date().getFullYear();
    this.currentYear = currentYear;
    this.Years = []; 
    for (let i = 0; i <= 5; i++) {
      this.Years.push(currentYear - i);
    }
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

export interface Months{
  id:number;
  MonthName:string;
}