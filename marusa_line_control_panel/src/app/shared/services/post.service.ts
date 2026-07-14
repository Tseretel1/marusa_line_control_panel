import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { InsertPost } from '../../pages/edit-post/edit-post.component';
import { UntypedFormBuilder } from '@angular/forms';
import { orderStatuses, User, OrderCommentDto } from '../../pages/orders/order-details/order-details.component';
import { innerFrom } from 'rxjs/internal/observable/innerFrom';
import { getPosts } from '../../pages/posts/posts.component';
import { GetUserFilteredDto, GetusersDto } from '../../pages/users/users.component';
import { DashboardStatsByYear } from '../../pages/dashboard/dashboard.component';
import { InsertReview, ReviewDto } from '../../pages/edit-post/reviews/reviews.component';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PostService {

   private apiUrl = environment.apiUrl;
  constructor(private http:HttpClient)
  {

  }

  getPosts(getPosts:getPosts): Observable<GetPost[]> {
    return this.http.post<GetPost[]>(this.apiUrl+'ControlPanel/get-products',getPosts);
  }
  getPostWithId(id:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`ControlPanel/get-post-byid-controlpanel?id=${id}`);
  }
  addPost(obj: InsertPost): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/add-post`, obj);
  }
  addPosts(obj: FormData): Observable<any> {
    return this.http.post<any>(
      this.apiUrl + 'ControlPanel/add-post',
      obj
    );
  }

  EditPost(obj: InsertPost): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/edit-post`, obj);
  }
  EditShopPhoto(obj: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/edit-shop-photo`, obj);
  }
  EditPostPhotos(obj: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/edit-post-photos`, obj);
  }
  deletePhoto(PhotoId:number,preview:string): Observable<any> {
    return this.http.post<any>(this.apiUrl + `ControlPanel/delete-photo?photoId=${PhotoId}&photoUrl=${encodeURIComponent(preview)}`,{});
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
  getUserOrders(dto:GetOrderDto): Observable<OrderReturn> {
    return this.http.post<OrderReturn>(this.apiUrl+`ControlPanel/get-orders`,dto);
  }
  getOrderStatuses(): Observable<orderStatuses[]> {
    return this.http.get<orderStatuses[]>(this.apiUrl+'Product/get-order-statuses');
  }
  getOrderById(orderId:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`ControlPanel/get-order-details?orderId=${orderId}`);
  }
  AddOrderComment(orderId:number, comment:string): Observable<OrderCommentDto[]> {
    return this.http.post<OrderCommentDto[]>(this.apiUrl+`ControlPanel/add-order-comment`,{ orderId, comment });
  }
  getuserOptionalFields(userId:number): Observable<UserOptionalFields> {
    return this.http.get<UserOptionalFields>(this.apiUrl+`Product/get-users-optional?id=${userId}`);
  }
  changeOrderIsPaid(orderId:number, isPaid:boolean,quantity:number): Observable<any> {
    return this.http.post<any>(this.apiUrl+`ControlPanel/change-order-ispaid?orderId=${orderId}&ispaid=${isPaid}&quantity=${quantity}`,{});
  }
  changeOrderStatus(orderId:number, statusId:number): Observable<any> {
    return this.http.post<any>(this.apiUrl+`ControlPanel/change-order-status?orderId=${orderId}&statusId=${statusId}`,{});
  }
  deleteOrder(orderId:number,): Observable<any> {
    return this.http.delete<any>(this.apiUrl+`ControlPanel/delete-order?orderId=${orderId}`,{});
  }
  GetDahsboardStatistics(date:StartEndDate): Observable<any> {
    return this.http.post<any>(this.apiUrl+`ControlPanel/get-statistics`,date);
  }
  GetDahsboardByYear(year:number): Observable<DashboardStatsByYear> {
    return this.http.get<DashboardStatsByYear>(this.apiUrl+`ControlPanel/get-dashboard-by-year?year=${year}`,);
  }
  GetSoldProductTypes(year:number,month:number|null): Observable<SoldProductTypes[]> {
    return this.http.get<SoldProductTypes[]>(this.apiUrl+`ControlPanel/get-sold-producttypes?year=${year}&month=${month}`,);
  }
  getProductTypes(): Observable<ProductTypes[]> {
    return this.http.get<ProductTypes[]>(this.apiUrl+'ControlPanel/get-product-types');
  }
  searchProducts(dto:SearchProductsDto): Observable<SearchProductsResult> {
    return this.http.post<SearchProductsResult>(this.apiUrl+'Product/search-products',dto);
  }
  InsertProductTypes(productType:string): Observable<any> {
    return this.http.post<any>(this.apiUrl+`ControlPanel/insert-product-type?productType=${productType}`,{});
  }
  EditProductTypes(id:number,productType:string): Observable<any> {
    return this.http.post<any>(this.apiUrl+`ControlPanel/edit-product-type?id=${id}&productType=${productType}`,{});
  }
  DeleteProductTypes(id:number): Observable<any> {
    return this.http.delete<any>(this.apiUrl+`ControlPanel/delete-product-type?id=${id}`,{});
  }
  GetShopAdditionalParameters(): Observable<ProductAdditionalParamDto[]> {
    return this.http.get<ProductAdditionalParamDto[]>(this.apiUrl+`ControlPanel/get-shop-additional-params`);
  }
  GetProductAdditionalParams(productId:number): Observable<ProductAdditionalParamDto[]> {
    return this.http.get<ProductAdditionalParamDto[]>(this.apiUrl+`ControlPanel/get-product-additional-params?productId=${productId}`);
  }
  CreateAdditionalParameter(paramName:string): Observable<ProductAdditionalParamDto[]> {
    return this.http.post<ProductAdditionalParamDto[]>(this.apiUrl+`ControlPanel/create-additional-param`,{ paramName });
  }
  CreateAdditionalParameterValue(parameterId:number, value:string): Observable<ProductAdditionalParamDto[]> {
    return this.http.post<ProductAdditionalParamDto[]>(this.apiUrl+`ControlPanel/create-additional-param-value`,{ parameterId, value });
  }
  AssignAdditionalParam(productId:number, parameterId:number): Observable<ProductAdditionalParamDto[]> {
    return this.http.post<ProductAdditionalParamDto[]>(this.apiUrl+`ControlPanel/assign-additional-param`,{ productId, parameterId });
  }
  RemoveAdditionalParam(productId:number, parameterId:number): Observable<ProductAdditionalParamDto[]> {
    return this.http.delete<ProductAdditionalParamDto[]>(this.apiUrl+`ControlPanel/remove-additional-param?productId=${productId}&parameterId=${parameterId}`);
  }
  DeleteAdditionalParameter(parameterId:number): Observable<ProductAdditionalParamDto[]> {
    return this.http.delete<ProductAdditionalParamDto[]>(this.apiUrl+`ControlPanel/delete-additional-param?parameterId=${parameterId}`);
  }
  DeleteAdditionalParameterValue(valueId:number): Observable<ProductAdditionalParamDto[]> {
    return this.http.delete<ProductAdditionalParamDto[]>(this.apiUrl+`ControlPanel/delete-additional-param-value?valueId=${valueId}`);
  }
  DeleteProductPermanently(productId:number): Observable<any> {
    return this.http.delete<any>(this.apiUrl+`ControlPanel/delete-product-permanently?productId=${productId}`);
  }
  GetUsersList(filter:GetUserFilteredDto): Observable<GetusersDto[]> {
    return this.http.post<GetusersDto[]>(this.apiUrl+`ControlPanel/get-users`,filter);
  }
  GetFollowersList(filter:GetUserFilteredDto): Observable<GetusersDto[]> {
    return this.http.post<GetusersDto[]>(this.apiUrl+`ControlPanel/get-shop-followers`,filter);
  }
  GetUsersById(id:number): Observable<GetusersDto> {
    return this.http.get<GetusersDto>(this.apiUrl+`ControlPanel/get-user-by-id?id=${id}`);
  }
  GetUsersByName(search:string): Observable<GetusersDto[]> {
    return this.http.get<GetusersDto[]>(this.apiUrl+`ControlPanel/get-user-by-name?search=${search}`);
  }
  GetUsersByEmail(search:string): Observable<GetusersDto[]> {
    return this.http.get<GetusersDto[]>(this.apiUrl+`ControlPanel/get-user-by-email?search=${search}`);
  }
  BlockOrUnblockUser(id:number,): Observable<any> {
    return this.http.post<any>(this.apiUrl+`ControlPanel/block-user?userId=${id}`,{});
  }
  UpdateProductOrderAllowed(productid:number, allowed:boolean): Observable<any> {
    return this.http.put<any>(this.apiUrl+`ControlPanel/update-product-order-allowed?productID=${productid}&allowed=${allowed}`,{});
  }
  UpdateQuantity(productid:number, quantity:number): Observable<any> {
    return this.http.put<any>(this.apiUrl+`ControlPanel/update-quantity?productId=${productid}&quantity=${quantity}`,{});
  }
  getShopStats(): Observable<any> {
    return this.http.get<any>(this.apiUrl+`ControlPanel/get-shop-stats`);
  }
  getShopById(): Observable<any> {
    return this.http.get<any>(this.apiUrl+`ControlPanel/get-shop-by-id`);
  }
  UpdateShop(Newshop:Shop): Observable<any> {
    return this.http.put<any>(this.apiUrl+`ControlPanel/update-shop`,Newshop);
  }

  
  //Reviews
  InsertReviews(review:InsertReview): Observable<any> {
    return this.http.post<any>(this.apiUrl+`Review/insert-reviews`,review);
  }
  GetReviews(productId:number, pageNumber:number, pageSize:number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(this.apiUrl+`Review/get-reviews?productId=${productId}&pageNumber=${pageNumber}&pageSize=${pageSize}`,);
  }
  DeleteReviews(reviewId:number): Observable<any> {
    return this.http.delete<any>(this.apiUrl+`Review/delete-reviews?Id=${reviewId}`);
  }


}
export interface StartEndDate{
  startDate :string;
  endDate :string;
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
  totalActiveProducts:number;
  totalDeletedProducts:number;
  orderNotAllowed:boolean;
}

export interface SearchProductsDto{
  userId:number;
  shopId:number;
  searchTerm:string;
  pageNumber:number;
  pageSize:number;
}

export interface SearchProductResult{
  id:number;
  title:string;
  description:string;
  price:number;
  discountedPrice:number;
  productTypeId:number;
  quantity:number;
  likeCount:number;
  isLiked:boolean;
  photoId:number|null;
  photoUrl:string|null;
  orderNotAllowed:boolean;
  shopId:number;
}

export interface SearchProductsResult{
  products:SearchProductResult[];
  totalCount:number;
}

export interface ProductTypes{
 id:number;
 productType:string;
}

export interface AdditionalParamValueDto{
  valueId:number;
  value:string;
}

export interface ProductAdditionalParamDto{
  parameterId:number;
  paramName:string;
  values:AdditionalParamValueDto[];
}



 interface Photo {
  id?: number;  
  photoId?: number;  
  photoUrl?: string;
  postId?: number;
}

export interface OrderReturn{
  orders : OrderProduct[];
  totalCount:number;
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
  orderNumber: number;

  likeCount: number;
  isLiked: boolean;

  photos: Photo[];
  user:user;
  totalCount :number;
  lastOwnerComment: string | null;
  lastOwnerCommentDate: string | null;
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
  UserId:number|null;
  OrderId:number|null;
  IsPaid:boolean|null;
  PageSize:number;
  PageNumber:number;
}

export interface SoldProductTypes{
    productTypeId:number,
    soldCount: number
}


export interface Shop {
  id: number;
  name: string;
  logo: string | null;
  location: string | null;
  gmail: string;
  subscription: string;
  instagram: string | null;
  facebook: string | null;
  titkok: string | null;
  bog: string|null,
  tbc: string|null,
  receiver: string|null,
}
