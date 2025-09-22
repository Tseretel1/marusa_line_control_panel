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
  uploadPhotos: {
    id: number;
    preview?: string | ArrayBuffer | null;
    file?: File | null;
  }[] = [];

  getPost() {
    this.postService.getPostWithId(this.postId).subscribe((resp) => {
      this.posts = resp[0];
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

  sendApplicationtoBackend() {
    if (this.title && this.productTypeId && this.price > 0) {
      this.uploadAllImages().subscribe({
        next: (results) => {
          const InsertPost: InsertPost = {
            Id : this.postId,
            title: this.title,
            productTypeId: this.productTypeId,
            price: this.price,
            discountedPrice: this.discountedPrice,
            description: this.description,
            quantity: this.quantity,
            photos: this.InsertPhotos,
          };
          console.log(InsertPost);
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
                }).then((results) => {
                  // window.location.reload();
                });
                setTimeout(() => {
                  // window.location.reload();
                }, 3000);
              }
            },
            (error) => {
              console.error(error);
            }
          );
        },
        error: (err) => {
          console.error('Upload failed:', err);
        },
      });
    } else {
      console.warn('Validation failed!');
    }
  }



  triggerFileInput(index: number): void {
    const fileInput = document.getElementById(
      'photo-' + index
    ) as HTMLInputElement;
    fileInput.click();
  }

  onFileChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.uploadPhotos[index].file = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.uploadPhotos[index].preview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.uploadPhotos[index].file = null;
      this.uploadPhotos[index].preview = null;
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

  uploadAllImages(): Observable<any[]> {
    const uploads: Observable<any>[] = [];
    this.uploadPhotos.forEach((p, index) => {
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
