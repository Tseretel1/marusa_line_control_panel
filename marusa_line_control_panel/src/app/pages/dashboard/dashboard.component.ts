import { Component, OnInit } from '@angular/core';
import { Dashboard, Months } from '../orders/orders.component';
import { PostService, StartEndDate } from '../../shared/services/post.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  ngOnInit(): void {
    this.getDashboardStats();
  }

  constructor(private service:PostService){
    
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
      const today = new Date().getDate();
      this.endDate = `${this.currentYear}-${endMonthString}-${today}`;
    } else {
      const lastDay = new Date(this.currentYear, this.endMonthNum, 0).getDate();
      this.endDate = `${this.currentYear}-${endMonthString}-${lastDay}`;
      }
    }
  
    getDashboardStats(){
      this.dateBulilder();
      const dashboard:StartEndDate={
        startDate :this.startDate,
        EndDate :this.endDate,
      }
      console.log(dashboard)
      this.service.GetDahsboardStatistics(dashboard).subscribe(
        (resp)=>{
          this.dashboardStats = resp.statistics;
        }
      )
    }
    dateOpened:number = 0;
    dateOpen(num:number){
      this.dateOpened = num;
    }
    dateHide(){
      this.dateOpened= 0;
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
    changeStartMonth(monthNum:number){
      this.startMonthNum = monthNum;
      setTimeout(() => {
        this.dateHide();
      }, 100);
    }
    changeEndMonth(monthNum:number){
      this.endMonthNum = monthNum;
      setTimeout(() => {
        this.dateHide();
      if (this.endMonthNum === new Date().getMonth()+1) {
        this.thisLastDay = new Date().getDate();
      } else {
        this.thisLastDay =new Date(this.currentYear, this.endMonthNum, 0).getDate(); 
      }
      }, 100);
    }
  
   startMonthNum:number = 1;
  endMonthNum:number = 1;
  setStartMonth() {
     this.startMonthNum = new Date().getMonth()+ 1;
  }
  setEndMonth() {
     this.endMonthNum = new Date().getMonth() + 1;
     this.getEndDay();
  }
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
  changeYear(num:number){
    this.currentYear = num;
    setTimeout(() => {
      this.dateHide();
    }, 100);
  }
}
