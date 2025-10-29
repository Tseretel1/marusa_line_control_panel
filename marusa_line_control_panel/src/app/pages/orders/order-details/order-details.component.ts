import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import * as  AOS from 'aos';
import Swal from 'sweetalert2';
import { FormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { PostService } from '../../../shared/services/post.service';


@Component({
  selector: 'app-order-details',
  imports: [CommonModule,FormsModule,DatePipe],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
 


  productId:number = 0;
  posts:Post = {} as Post;
  order:OrderDetailsDto = {} as OrderDetailsDto;
  photosArray:Photo[]= [];
  postsLoaded:boolean = false;

  user:any = null;
  userId:number = 0;
  constructor(private postService:PostService, private route :ActivatedRoute){
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = Number(id);
    this.getOrderStatuses();
    this.postService.getOrderById(this.productId).subscribe(
      (resp)=>{
        this.posts = resp.product;
        this.order = resp.orders;
        this.comment = this.order.comment;
        this.user = this.order.user;
        console.log(this.user)
        this.posts.photos.forEach(item => {
          this.photosArray.push(item);
        });
        this.productPrice = this.order.finalPrice;
        this.postsLoaded = true;
      }
    );
  }
  ngOnInit(): void {
    AOS.init({
      easing: 'ease-in-out',
      once: false, 
    });
    window.scrollTo({
     top: 0,
     behavior: 'smooth' 
   }); 
  }



  mobileNumber:string = '';
  address:string = '';

  oldMobileNumber:string = '';
  oldAddress:string = '';
  productPrice:number = 0;
  oneProductPrice:number = 0;
  productQuantity:number = 1;
  comment:string = '';


  orderStatuses:orderStatuses[]= [];
  getOrderStatuses(){
    this.postService.getOrderStatuses().subscribe(
      (resp)=>{
        this.orderStatuses = resp;
      }
    )
  }
  getStatusName(statusid:number){
    const name  = this.orderStatuses.find((x)=> x.id == statusid);
    return name?.statusName;
  }


  changeOrderIsPaid(isPaid:boolean){
    if(isPaid){
      this.order.isPaid = true;
    }
    else{
      this.order.isPaid = false;
    }
    this.postService.changeOrderIsPaid(this.order.orderId, isPaid).subscribe((resp)=>{});
    this.modalGroupNum = 0;
  }

  modalGroupNum:number = 0;
  openModal(num:number){
    this.modalGroupNum = num;
  }
  modalcancel(){
    this.modalGroupNum = 0;
  }
}

 interface Photo {
  Id?: number;
  photoId?: number;
  photoUrl?: string;
  postId?: number;
}


export interface Post {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  photoUrl?: string | null; 
  photoId?: number | null;  
  postId?: number;        
  likeCount: number;  
  isLiked:boolean;  
  quantity:number;    
  photos: Photo[];
}

export interface OrderDetailsDto {
  orderId: number;
  userId: number;
  productId: number;
  isPaid: boolean;
  statusId: number;
  createDate: string; 
  deliveryType?: string;
  productQuantity: number;
  comment: string;
  finalPrice: number;
  user:User;
}


export interface ProductTypes{
 id:number;
 productType:string;
}
export interface orderStatuses{
 id:number;
 statusName:string;
}

export interface UserOptionalFields{
  id:number;
  location:string;
  phoneNumber:string;
}
export interface User{
  id:number;
  name:string;
  lastName:string;
  location:string;
  profileNumber:string;
  profilePhoto:string;
  email:string;
}