import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsertPost } from '../../pages/edit-post/edit-post.component';
import { UntypedFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'https://localhost:7173/';
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
    return this.http.get<GetPost[]>(this.apiUrl+'Product/get-posts-for-adminpanel');
  }
  getPostWithId(id:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`Product/get-post-with-id?id=${id}`);
  }

  addPost(obj: InsertPost): Observable<any> {
    return this.http.post<any>(this.apiUrl + `Product/add-post`, obj);
  }

  EditPost(obj: InsertPost): Observable<any> {
    return this.http.post<any>(this.apiUrl + `Product/edit-post`, obj);
  }

  deletePhoto(PhotoId:number): Observable<any> {
    return this.http.post<any>(this.apiUrl + `Product/delete-photo?photoId=${PhotoId}`,{});
  }
  getProductTypes(): Observable<ProductTypes[]> {
    return this.http.get<ProductTypes[]>(this.apiUrl+'Product/get-product-types');
  }
  getTotalLikesCount(): Observable<number> {
    return this.http.get<number>(this.apiUrl+'Product/get-like-count');
  }
  removePost(postId:number): Observable<number> {
    return this.http.post<number>(this.apiUrl+`Product/remove-post?postid=${postId}`,{});
  }
  revertPost(postId:number): Observable<number> {
    return this.http.post<number>(this.apiUrl+`Product/revert-post?postid=${postId}`,{});
  }
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