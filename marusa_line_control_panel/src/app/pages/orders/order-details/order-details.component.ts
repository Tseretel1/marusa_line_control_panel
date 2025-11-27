import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, ɵEmptyOutletComponent } from '@angular/router';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import * as  AOS from 'aos';
import Swal from 'sweetalert2';
import { FormsModule, ɵInternalFormsSharedModule } from "@angular/forms";
import { PostService } from '../../../shared/services/post.service';
import { AppRoutes } from '../../../shared/AppRoutes/AppRoutes';
import * as L from 'leaflet';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, FormsModule, DatePipe, ɵEmptyOutletComponent],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent implements OnInit{
 
  AppRoutes = AppRoutes;

  productId:number = 0;
  posts:Post = {} as Post;
  order:OrderDetailsDto = {} as OrderDetailsDto;
  photosArray:Photo[]= [];
  postsLoaded:boolean = false;

  user:any = null;
  userId:number = 0;
  constructor(private postService:PostService, private route :ActivatedRoute,private router :Router){
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = Number(id);
    this.getOrderStatuses();
    this.postService.getOrderById(this.productId).subscribe(
      (resp)=>{
        this.posts = resp.product;
        this.order = resp.orders;
        this.Map.lat = this.order.lat;
        this.Map.lng = this.order.lng;
        this.comment = this.order.comment;
        this.user = this.order.user;
        this.posts.photos.forEach(item => {
          this.photosArray.push(item);
        });
        this.productPrice = this.order.finalPrice;
        this.postsLoaded = true;
        this.initMap();
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
    this.postService.changeOrderIsPaid(this.order.orderId, isPaid, this.order.productQuantity).subscribe((resp)=>{});
    this.modalGroupNum = 0;
  }
  changeOrderStatusId(statusId:number){
    this.order.statusId = statusId; 
    this.postService.changeOrderStatus(this.order.orderId,statusId).subscribe((resp)=>{});
    this.modalGroupNum = 0;
  }


  deleteOrder(statusId:number){
    Swal.fire({
    title: 'შეკვეთის წაშლა',
    icon:'error',
    text: 'ნამდვილად გსურთ შეკვეთის წაშლა?',
    showCancelButton: true,
    confirmButtonText: 'წაშლა',
    cancelButtonText: 'გაუქმება',
    color: '#ffffff',       
    background:'rgb(25, 26, 25)',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    customClass: {
      popup: 'custom-swal-popup',
    }
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deleteOrder(this.order.orderId,).subscribe((resp)=>{
          this.router.navigate([AppRoutes.orders])
        });
      }
    });
  }
  
  
  modalGroupNum:number = 0;
  openModal(num:number){
    this.modalGroupNum = num;
  }
  modalcancel(){
    this.modalGroupNum = 0;
  }
  Map: Lnglat = {
    lat: '',
    lng: '',
  };

  map!: L.Map;
  marker!: L.Marker;
  location: Lnglat = {
    lat: '',
    lng: '',
  };



  initMap(): void {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      iconUrl: 'assets/leaflet/marker-icon.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [20, 30],
    });

    let lat = Number(this.Map.lat);
    let lng = Number(this.Map.lng);
    this.map = L.map('map').setView([lat, lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    if (!isNaN(lat) && !isNaN(lng)) {
      this.marker = L.marker([lat, lng]).addTo(this.map);
      this.location = { lat: lat.toString(), lng: lng.toString() };
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      this.location = { lat: lat.toString(), lng: lng.toString() };
    });
  }
    copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
    .then(() => {
    })
    .catch(err => {
    });
    setTimeout(() => {
    }, 3000);
  }
}

export interface Lnglat {
  lat: string;
  lng: string;
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
  address:string;
  lng:string;
  lat:string;
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