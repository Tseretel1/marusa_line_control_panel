import { HttpClient, HttpParamsOptions } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsertPost } from '../../pages/edit-post/edit-post.component';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = 'https://192.168.1.14:7174/';
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
    return this.http.get<GetPost[]>(this.apiUrl+'post/get-posts');
  }
  getPostWithId(id:number): Observable<any> {
    return this.http.get<any>(this.apiUrl+`post/get-post-with-id?id=${id}`);
  }

  addPost(obj: InsertPost): Observable<any> {
    return this.http.post<any>(this.apiUrl + `post/add-post`, obj);
  }

  EditPost(obj: InsertPost): Observable<any> {
    return this.http.post<any>(this.apiUrl + `post/edit-post`, obj);
  }

  deletePhoto(PhotoId:number): Observable<any> {
    return this.http.post<any>(this.apiUrl + `post/delete-photoId=${PhotoId}`,{});
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
  productType:string;
  discountedPrice: number;
  photoUrl?: string | null; 
  photoId?: number | null;  
  postId?: number;        
  likeCount: number;        
  photos: GetPhoto[];
  quantity: number;
}