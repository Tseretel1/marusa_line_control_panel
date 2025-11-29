import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos'
import { Observable, forkJoin, tap,} from 'rxjs';
import { PostService, ProductTypes } from '../../shared/services/post.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
@Component({
  selector: 'app-add-post',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss'
})


export class AddPostComponent implements OnInit{

  AppRoutes = AppRoutes;
  constructor(private postService:PostService,private router: Router){
  }

  ngOnInit(): void {
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
      once: false, 
    });
    this.getProductTypes();
  }
  productTypesList :ProductTypes[]= [];
  getProductTypes(){
    this.postService.getProductTypes().subscribe(
      (resp)=>{
        this.productTypesList = resp;
      }
    )
  }
  title: string = '';
  productTypeId: number = 0;
  price!: number;
  discountedPrice!: number;
  description: string = '';
  quantity!: number;
  photos: Insertphoto[] = [];
  InsertPhotos: Insertphoto[] = [];

  validatedata(): any {
    if (this.title != '' && this.productTypeId != 0 && this.price != 0) {
      const InsertPost: InsertPost = {
        title: this.title,
        productTypeId: this.productTypeId,
        price: this.price,
        discountedPrice: this.discountedPrice,
        description: this.description,
        quantity: this.quantity,
        photos: [],
      };
      return InsertPost;
    }
    return null;
  }

  sendApplicationtoBackend() {
    if (this.title && this.productTypeId && this.price > 0) {
      this.uploadAllImages().subscribe({
        next: (results) => {
          const InsertPost: InsertPost = {
            title: this.title,
            productTypeId:Number(this.productTypeId),
            price: this.price,
            discountedPrice: this.discountedPrice,
            description: this.description,
            quantity: this.quantity,
            photos: this.InsertPhotos,
          };
          console.log(InsertPost);
          this.postService.addPost(InsertPost).subscribe(
            (resp) => {
              if (resp != null) {
                Swal.fire({
                  icon: 'success',
                  timer: 3000,
                  showConfirmButton: true,
                  confirmButtonText: 'ოქეი',
                  confirmButtonColor: 'green',
                  title: 'პოსტი წარმატებით დაემატა!',
                }).then((results) => {
                  this.router.navigate([this.AppRoutes.posts])
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

  uploadPhotos: {
    id: number;
    preview?: string | ArrayBuffer | null;
    file?: File | null;
  }[] = [];

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
    console.log(id);
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
        const photo = this.uploadPhotos.find((p) => p.id === id);
        if (photo) {
          photo.file = null;
          photo.preview = null;
        }
        this.uploadPhotos = this.uploadPhotos.filter(x=>x.id===id);
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
