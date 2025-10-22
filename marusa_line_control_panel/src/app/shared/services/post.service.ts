import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsertPost } from '../../pages/edit-post/edit-post.component';
import { UntypedFormBuilder } from '@angular/forms';
import { orderStatuses } from '../../pages/orders/order-details/order-details.component';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'https://192.168.1.11:7174/';
  constructor(private http:HttpClient)
  {

  }
  private cloudName = 'ds1q7oiea';
  private uploadPreset = 'cloudinary_Upload_Preset';

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    return this.http.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      formData
    );
  }



  getPosts(): Observable<GetPost[]> {
    return this.http.get<GetPost[]>(this.apiUrl+'ControlPanel/get-products');
  }
  getPostWithId(id:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`ControlPanel/get-post-byid-controlpanel?id=${id}`);
  }

  addPost(obj: InsertPost): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/add-post`, obj);
  }

  EditPost(obj: InsertPost): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/edit-post`, obj);
  }

  deletePhoto(PhotoId:number): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/delete-photo?photoId=${PhotoId}`,{});
  }
  getProductTypes(): Observable<ProductTypes[]> {
    return this.http.get<ProductTypes[]>(this.apiUrl+'ControlPanel/get-product-types');
  }
  getTotalLikesCount(): Observable<number> {
    return this.http.get<number>(this.apiUrl+'ControlPanel/get-like-count');
  }
  removePost(postId:number): Observable<number> {
    return this.http.post<number>(this.apiUrl+`ControlPanel/remove-post?postid=${postId}`,{});
  }
  revertPost(postId:number): Observable<number> {
    return this.http.post<number>(this.apiUrl+`ControlPanel/revert-post?postid=${postId}`,{});
  }
  getUserOrders(dto:GetOrderDto): Observable<OrderProduct[]> {
    return this.http.post<OrderProduct[]>(this.apiUrl+`ControlPanel/get-orders`,dto);
  }
  getOrderStatuses(): Observable<orderStatuses[]> {
    return this.http.get<orderStatuses[]>(this.apiUrl+'Product/get-order-statuses');
  }
  getOrderById(orderId:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Product/get-order-details?orderId=${orderId}`);
  }
  getuserOptionalFields(userId:number): Observable<UserOptionalFields> {
    return this.http.get<UserOptionalFields>(this.apiUrl+`Product/get-users-optional?id=${userId}`);
  }
}

export interface UserOptionalFields{
  id:number;
  location:string;
  phoneNumber:string;
}
export interface GetPhoto {
  id?: number;  
  photoId?: number;  
  photoUrl?: string;
  postId?: number;
}

export interface GetPost {
  id: number;
  title: string;
  description: string;
  price: number;
  productTypeId:number;
  discountedPrice: number;
  photoUrl?: string | null; 
  photoId?: number | null;  
  postId?: number;        
  likeCount: number;        
  photos: GetPhoto[];
  quantity: number;
  dateDeleted:string|null;
}

export interface ProductTypes{
 id:number;
 productType:string;
}



 interface Photo {
  id?: number;  
  photoId?: number;  
  photoUrl?: string;
  postId?: number;
}

export interface OrderProduct {
  orderId: number;       
  createDate: string;     
  statusId: number;
  isPaid: boolean;
  quantity:number;
  id: number;
  productId: number;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  productTypeId: number;
  finalPrice:number;
  comment:string;
  deliveryType:string;
  productQuantity:string;

  likeCount: number;
  isLiked: boolean;

  photos: Photo[];
  user:user;
  totalCount :number;
}


export interface user{
  id: number;
  name: number;
  email:string;
  phoneNumber:string;
  location:string;
  profilePhoto:string;
}


export interface GetOrderDto{
  OrderId:number|null;
  IsPaid:boolean|null;
  PageSize:number;
  PageNumber:number;
}