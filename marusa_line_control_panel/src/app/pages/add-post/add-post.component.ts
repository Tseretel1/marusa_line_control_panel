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



  sendApplicationtoBackend() {
      const validations = [
        { condition: !!this.title, message: 'შეიყვანეთ დასახელება' },
        { condition: !!this.productTypeId && this.productTypeId!=0, message: 'აირჩიეთ პროდუქტის ტიპი' },
        { condition: this.price > 0, message: 'ფასი უნდა აღემატებოდეს ნულს' },
        { condition: this.uploadPhotos.length > 0, message: 'ატვირთეთ მინიმუმ 1 ფოტო' },
      ];
    
      const failed = validations.find(v => !v.condition);
    
      if (failed) {
        Swal.fire({
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: 'green',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',    
          title:failed.message,
        });
        return;
      }

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
            orderNotAllowed: this.orderNotAllowed,
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
                  background:'rgb(25, 26, 25)',
                  color: '#ffffff',    
                  confirmButtonColor: 'green',
                  title: 'პროდუქტი წარმატებით დაემატა!',
                }).then((results) => {
                  this.router.navigate([this.AppRoutes.posts])
                });
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
  if (!this.uploadPhotos.some(p => p.id === id)) return;
  this.uploadPhotos = this.uploadPhotos.filter(p => p.id !== id);
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


  orderNotAllowed:boolean = true;
  ToggleorderNotAllowed(allowed:boolean){
    this.orderNotAllowed = allowed;
  }
}

export interface InsertPost {
  title: string;
  productTypeId: number;
  description: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  orderNotAllowed:boolean;
  photos: Insertphoto[];
}
export interface Insertphoto {
  photoUrl: string;
}
