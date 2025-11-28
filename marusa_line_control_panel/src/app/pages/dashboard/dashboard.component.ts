import { Component, numberAttribute, OnInit } from '@angular/core';
import { Dashboard, Months } from '../orders/orders.component';
import { PostService, ProductTypes, SoldProductTypes, StartEndDate } from '../../shared/services/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  currentYear:number =  new Date().getFullYear();
  currentMonth:number =  new Date().getMonth()+1;
  
  ngOnInit(): void {
    this.setStats();
  }
  setStats(){
    this.generateMonthsList();
    this.generateYearsList();
    this.getYearlyOudit();
    this.getProductTypes();
    this.getsoldProductStatistics();
  }
  constructor(private service:PostService){
    
  }
  dashboard!:DashboardStatsByYear;
  getYearlyOudit(){
    this.service.GetDahsboardByYear(this.currentYear).subscribe(
      (resp)=>{
        this.dashboard = resp;
        console.log(resp)
      }
    )
  }

  soldProductTypes:SoldProductTypes[]=[];
  getsoldProductStatistics(){
    this.service.GetSoldProductTypes(this.currentYear, this.currentMonth).subscribe(
      (resp)=>{
        this.soldProductTypes = resp;
      }
    )
  }
  productTypesList :ProductTypes[]= [];
  getProductTypes(){
    this.service.getProductTypes().subscribe(
      (resp)=>{
        this.productTypesList = resp;
      }
  )}
  getProductTypeName(id:number) : string {
    const productName = this.productTypesList.find(x=>x.id==id);
    if(productName){
      return productName.productType;
    }
    return '';
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

  

  getmonthName(monthNum:number) {
    const found = this.MonthsList.find(m => m.id === monthNum);
    return found?.MonthName;
  }
  Years:number[]=[]
  generateYearsList() {
    this.Years = []; 
    for (let i = 0; i <= 3; i++) {
      this.Years.push(this.currentYear - i);
    }
  }
  changeYear(num:number){
    this.currentYear = num;
    this.getYearlyOudit();
  }
  changeMonth(num:number){
    this.currentMonth = num;
    this.getsoldProductStatistics ();
  }

}


export interface DashboardStatsByMonths {
  monthNumber: number;
  orderCount: number;
  totalAmount: number;
}

export interface DashboardYearSum {
  orderCount: number;
  totalAmount: number;
}
export interface DashboardStatsByYear {
  statsByMonth: DashboardStatsByMonths[];
  yearStat: DashboardYearSum;
}