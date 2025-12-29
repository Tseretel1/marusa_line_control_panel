import { Component, OnInit } from '@angular/core';
import { PostService } from '../../shared/services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule,FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{
  constructor (private service:PostService){

  }
  ngOnInit(): void {
    this.getUsers();
  }
  
  userId:number |null= null;
  getuserFitler:GetUserFilteredDto={
    userId: null,
    isBlocked :null,
    pageNumber:1,
    pageSize:100,
  }
  users:GetusersDto[]= [];
  totalCount:number = 0;
  getUsers(){
    this.service.GetUsersList(this.getuserFitler).subscribe((resp)=>{
      this.users = resp;
      this.hideInputsModal();
      this.CreatePagenation(this.users[0].totalCount)
    })
  }
  CreatePagenation(totalcount:number){
    this.totalCount = totalcount; 
    this.totalPages = Math.ceil(this.totalCount / this.getuserFitler.pageSize);
    this.lastPage = Math.ceil(this.totalCount / this.getuserFitler.pageSize);
  }
  blockModalNum:number = 0;
  isBlocked :boolean = false;
  openBlockModal(num:number, block :boolean){
    this.blockModalNum = num;
    this.isBlocked = block;
  }
  hideBlockModal(){
    this.blockModalNum = 0;
  }

  blockOrUnblockUser(role:string){
    this.service.BlockOrUnblockUser(this.blockModalNum,role).subscribe((resp)=>{
      if(resp!=null){
        const user = this.users.find(x => x.id === this.blockModalNum);
        if (user) {
          user.role = role;
        }
        this.hideBlockModal();
      }
    })
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

  getUsersBlockedNumber(): number {
    return this.users.filter(u => u.role === 'Blocked').length;
  }
  getUsersNotBlockedNumber(): number {
    return this.users.filter(u => u.role === 'User').length;
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
}

export interface GetUserFilteredDto {
  userId: number|null;      
  isBlocked: boolean|null; 
  pageNumber: number;   
  pageSize: number;     
}
