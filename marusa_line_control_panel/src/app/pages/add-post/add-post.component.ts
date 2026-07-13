import { CommonModule, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos'
import { Observable, forkJoin, tap,} from 'rxjs';
import { PostService, ProductTypes } from '../../shared/services/post.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import { AdditionalParamsComponent } from '../../shared/components/additional-params/additional-params.component';
@Component({
  selector: 'app-add-post',
  imports: [CommonModule,FormsModule,AdditionalParamsComponent],
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
  productTypeId: number|null = null;
  price!: number;
  discountedPrice!: number;
  description: string = '';
  quantity!: number;
  photos: Insertphoto[] = [];
  InsertPhotos: Insertphoto[] = [];
  selectedParamIds: number[] = [];


sendApplicationtoBackends() {
  const validations = [
    { condition: !!this.title, message: 'შეიყვანეთ დასახელება' },
    { condition: !!this.productTypeId, message: 'აირჩიეთ პროდუქტის ტიპი' },
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
  const formData = new FormData();
  formData.append('title', this.title);
  formData.append('description', this.description);
  formData.append('price', this.price.toString());
  formData.append('discountedPrice', (this.discountedPrice ?? 0).toString());
  formData.append('quantity', (this.quantity ?? 0).toString());
  formData.append('productTypeId', (this.productTypeId ?? 0).toString());
  formData.append('orderNotAllowed', this.orderNotAllowed.toString());

  for (let p of this.uploadPhotos) {
    if (p.file) {
      formData.append('photos', p.file); 
    }
  }
  console.log(formData)
  this.postService.addPosts(formData).subscribe({
    next: (res) => {
       if (res != null) {
          const assignParams$ = this.selectedParamIds.length > 0
            ? forkJoin(this.selectedParamIds.map(paramId => this.postService.AssignAdditionalParam(res, paramId)))
            : null;

          const showSuccessAndNavigate = () => {
            Swal.fire({
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
              confirmButtonText: 'ოქეი',
              background:'rgb(25, 26, 25)',
              color: '#ffffff',
              confirmButtonColor: 'green',
              title: 'პროდუქტი წარმატებით დაემატა!',
            }).then((results) => {
              this.router.navigate([this.AppRoutes.posts])
            });
          };

          if (assignParams$) {
            assignParams$.subscribe({
              next: () => showSuccessAndNavigate(),
              error: (err) => {
                console.error(err);
                showSuccessAndNavigate();
              }
            });
          } else {
            showSuccessAndNavigate();
          }
        }
    },
    error: (err) => {
      console.error(err);
    }
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
  //  const maxSize = 10 * 1024 * 1024; 

  //   if (file.size > maxSize) {

  //        Swal.fire({
  //           icon: 'error',
  //           timer: 3000,
  //           showConfirmButton: false,
  //           confirmButtonColor: 'green',
  //           background:'rgb(25, 26, 25)',
  //           color: '#ffffff',    
  //           title:"გთხოვთ ატვირთოთ 10mb ზე მცირე ფოტო",
  //         });
  //     return;
  //   }
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


  orderNotAllowed:boolean = true;
  ToggleorderNotAllowed(allowed:boolean){
    this.orderNotAllowed = allowed;
  }
}

export interface InsertPost {
  title: string;
  productTypeId: number|null;
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
