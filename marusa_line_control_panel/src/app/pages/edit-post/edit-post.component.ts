import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as AOS from 'aos';
import { forkJoin, Observable, tap } from 'rxjs';
import {
  GetPhoto,
  GetPost,
  PostService,
  ProductTypes,
} from '../../shared/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss',
})
export class EditPostComponent {
  postId: number = 0;
  posts: GetPost = {} as GetPost;
  photosArray: GetPost[] = [];
  InsertPhotos: Insertphoto[] = [];
  constructor(private route: ActivatedRoute, private postService: PostService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.postId = Number(id);
  }

  productTypesList :ProductTypes[]= [];
  getProductTypes(){
    this.postService.getProductTypes().subscribe(
      (resp)=>{
        this.productTypesList = resp;
      }
    )
  }

  photoId: number = 1;
  ngOnInit(): void {
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
      once: false,
    });
    this.getProductTypes();
    this.getPost();
  }


  getPost() {
    this.postService.getPostWithId(this.postId).subscribe((resp) => {
      console.log(resp)
      this.posts = resp;
      this.title = this.posts.title;
      this.description = this.posts.description;
      this.productTypeId = this.posts.productTypeId;
      this.price = this.posts.price;
      this.discountedPrice = this.posts.discountedPrice;
      this.photos = this.posts.photos;
      console.log(this.photos);
      this.uploadPhotos = this.photos.map(item => ({
        id: item.photoId!,                   
        preview: item.photoUrl ?? null, 
        file: null
      }));
      this.quantity = this.posts.quantity;
      if (this.posts.discountedPrice != null &&this.posts.discountedPrice > 0) {
        this.discountAmountChangeDetection();
      }
    });
  }
  title: string = '';
  productTypeId: number = 0;
  price!: number;
  discountedPrice!: number;
  description: string = '';
  quantity!: number;
  photos: GetPhoto[] = [];

  // validatedata(): any {
  //   if (this.title != '' && this.productTypeId != 0 && this.price != 0) {
  //     const InsertPost: InsertPost = {
  //       title: this.title,
  //       productTypeId: this.productTypeId,
  //       price: this.price,
  //       discountedPrice: this.discountedPrice,
  //       description: this.description,
  //       quantity: this.quantity,
  //       photos: [],
  //     };
  //     return InsertPost;
  //   }
  //   return null;
  // }


    uploadPhotos: {
    id: number;
    preview?: string | ArrayBuffer | null;
    file?: File | null;
  }[] = [];

   uploadPhotosTobackend: {
    id: number;
    preview?: string | ArrayBuffer | null;
    file?: File | null;
  }[] = [];
  uploadAllImages(): Observable<any[]> {
    const uploads: Observable<any>[] = [];
    this.uploadPhotosTobackend.forEach((p, index) => {
      if (p.file) {
        const upload$ = this.postService.uploadImage(p.file).pipe(
          tap((response: any) => {
            const photo : Insertphoto={
              photoUrl :response.secure_url
            }
            this.InsertPhotos.push(photo);
          })
        );
        uploads.push(upload$);
      }
    });
    return forkJoin(uploads);
  }


sendApplicationtoBackend() {
  if (!(this.title && this.productTypeId && this.price > 0)) {
    console.warn('Validation failed!');
    return;
  }
  const newFilesExist = this.uploadPhotos.some(p => p.file);

  if (newFilesExist) {
    this.InsertPhotos = [];
    this.uploadAllImages().subscribe({
      next: () => {
        this.submitPost();
      },
      error: (err) => {
        console.error('Upload failed:', err);
      }
    });
  } else {
    this.submitPost();
  }
}
private submitPost() {
  const photosToSend = this.InsertPhotos.length
    ? this.InsertPhotos
    : this.uploadPhotosTobackend
        .filter(p => p.preview) 
        .map(p => ({ photoUrl: p.preview as string }));

  const InsertPost: InsertPost = {
    Id: this.postId,
    title: this.title,
    productTypeId: this.productTypeId,
    price: this.price,
    discountedPrice: this.discountedPrice,
    description: this.description,
    quantity: this.quantity,
    photos: photosToSend,
  };

  this.postService.EditPost(InsertPost).subscribe(
    (resp) => {
      if (resp != null) {
        Swal.fire({
          icon: 'success',
          timer: 3000,
          showConfirmButton: true,
          confirmButtonText: 'ოქეი',
          confirmButtonColor: 'green',
          title: 'პოსტი წარმატებით რედაქტირდა!',
        });
      }
    },
    (error) => {
      console.error(error);
    }
  );
}



  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'photoinput'
    ) as HTMLInputElement;
    fileInput.click();
  }

  onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    const newPhoto: { id: number; preview: string | ArrayBuffer | null; file: File } = {
      id: Date.now(),
      file: file,
      preview: null
    };

    const reader = new FileReader();
    reader.onload = () => {
      newPhoto.preview = reader.result;
      this.uploadPhotos.push(newPhoto);
      this.uploadPhotosTobackend.push(newPhoto);
    };
    reader.readAsDataURL(file);
  }
  }


  discountedPercentage: number = 0;
  discountAmountChangeDetection() {
    this.discountedPercentage =
      ((this.price - this.discountedPrice) / this.price) * 100;
    this.discountedPercentage = Math.round(this.discountedPercentage);
  }
  removePhoto(id: number) {
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'არა',
      cancelButtonColor: 'red',
      confirmButtonText: 'დიახ',
      confirmButtonColor: 'green',
      title: 'ნამდვილად გსურთ ფოტოს წაშლა?',
    }).then((results) => {
      if (results.isConfirmed) {
         this.uploadPhotos = this.uploadPhotos.filter(p => p.id !== id);
             this.postService.deletePhoto(id).subscribe((resp)=>{
                console.log(resp);
             })        
      }
    });
  }


  removePost(){
    this.postService.removePost(this.postId).subscribe(
      (resp)=>{
        if(resp){
          this.posts.dateDeleted = new Date().toString();
        }
      }
    )
  }
  revertPost(){
    this.postService.revertPost(this.postId).subscribe(
      (resp)=>{
        if(resp){
          this.posts.dateDeleted = null;
        }
      }
    )
  }
}

export interface InsertPost {
  Id?:number;
  title: string;
  productTypeId: number;
  description: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  photos: Insertphoto[];
}
export interface Insertphoto {
  photoUrl: string;
}
