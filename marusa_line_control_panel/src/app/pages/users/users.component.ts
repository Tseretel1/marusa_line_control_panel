import { Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  imports: [CommonModule,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  constructor (private service:PostService,private router: Router){

  }
  ngOnInit(): void {
    this.getUsers();
  }
  
  userId:number |null= null;
  getuserFitler:GetUserFilteredDto={
    shopId:1,
    userId: null,
    isBlocked :null,
    pageNumber:1,
    pageSize:100,
  }
  users:GetusersDto[]= [];
  totalCount:number = 0;
  getUsers(){
    this.service.GetFollowersList(this.getuserFitler).subscribe((resp)=>{
      this.users = resp;
      this.hideInputsModal();
      this.CreatePagenation(this.users[0].totalCount);
      if(this.totalUserCount==0){
        this.getUserStats();
      }
    })
  }
  CreatePagenation(totalcount:number){
    this.totalCount = totalcount; 
    this.totalPages = Math.ceil(this.totalCount / this.getuserFitler.pageSize);
    this.lastPage = Math.ceil(this.totalCount / this.getuserFitler.pageSize);
  }
  UserId:number = 0;
  isBlocked :boolean = false;
  openBlockModal(num:number, block :boolean){
    this.UserId = num;
    this.isBlocked = block;
  }
  hideBlockModal(){
    this.UserId = 0;
  }

  blockOrUnblockUser(id: number) {
    this.service.BlockOrUnblockUser(id, 1).subscribe((resp) => {
      if (resp != null) {
        const user = this.users.find(x => x.id === id);
        if (user) {
          user.isBlocked = !user.isBlocked;
          if(user.isBlocked){
            this.blockedCount ++;
            this.NotblockedCount --;
          }
          else{
            this.blockedCount --;
            this.NotblockedCount ++;
          }
        }
        this.hideBlockModal();
      }
    });
  }


  getUserByBlocked(blocked:boolean){
    if(blocked){
      this.getuserFitler.isBlocked = true;
    }
    else{
      this.getuserFitler.isBlocked = false;
    }
    this.userId = null;
    this.getUsers();
  }
  getUserById(){
    this.getuserFitler.userId = this.userId;
    this.getuserFitler.isBlocked = null;
    this.getUsers();
  }
  getEveryUser(){
    this.getuserFitler.isBlocked = null;
    this.getuserFitler.userId = null;
    this.getUsers();
  }

  lastPage: number = 0; 
  selectedPage: number = 1;
  pageNumber: number = 1;
  changePage(page: number) {
    if (page < 1 || page > this.lastPage) return;
    this.selectedPage = page;
    this.getuserFitler.pageNumber = page;
    const middle = this.pageNumber + 2;
    if (page > middle) {
      this.pageNumber = page - 2;
    } else if (page < middle && this.pageNumber > 1) {
      this.pageNumber = Math.max(1, page - 2);
    }
    this.getUsers();
  }
  totalPages:number =0;

  copiedNumber:number = 0;
  spanId:number =0;
  copyToClipboard(text: string,numebr:number, spanId:number): void {
    this.copiedNumber = numebr;
    this.spanId = spanId;
    navigator.clipboard.writeText(text)
    .then(() => {
    })
    .catch(err => {
    });
    setTimeout(() => {
      this.copiedNumber = 0;
      this.spanId = 0;
    }, 3000);
  }

  NameSearch:string = '';
  EmailSearch:string = '';
  getUserByName(){
    this.service.GetUsersByName(this.NameSearch).subscribe(
      (resp)=>{
         this.users = resp;
         this.hideInputsModal();
      }
    )
  }
  getUserByEmail(){
    this.service.GetUsersByEmail(this.EmailSearch).subscribe(
      (resp)=>{
         this.users = resp;
         this.hideInputsModal();
         this.CreatePagenation(this.users[0].totalCount)
      }
    )
  }

  blockedCount:number = 0;
  NotblockedCount:number = 0;
  totalUserCount:number = 0;
  getUserStats() {
    this.blockedCount  =this.users.filter(u => u.isBlocked).length;
    this.NotblockedCount = this.users.filter(u => !u.isBlocked).length;
    this.totalUserCount = this.users.length;
  }

  getOrdersbyUserId(num:number,paidorders:number,unpaidorders:number){
    if(paidorders>0|| unpaidorders>0){
      localStorage.setItem('userIdToGetOrders',num.toString());
      this.router.navigate([AppRoutes.orders])
    }
    else{
      Swal.fire({
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: 'green',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          title:'მომხმარებელს არ აქვს შეკვეთები',
      });
    }
  }


  inputsModalVisible:boolean = false;
  openInputsModal(){
    this.inputsModalVisible = true;
  }
  hideInputsModal(){
    this.inputsModalVisible = false;
  }

}

export interface GetusersDto {
  id: number;
  email: string;
  name: string;
  profilePhoto: string;
  location: string;
  phoneNumber: string;
  role: string;
  totalCount:number;
  paidOrdersCount: number,
  unPaidOrdersCount: number,
  isBlocked: boolean,
}

export interface GetUserFilteredDto {
  userId: number|null;      
  isBlocked: boolean|null; 
  pageNumber: number;   
  pageSize: number;
  shopId:number;     
}
