import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ɵEmptyOutletComponent } from '@angular/router';
import * as AOS from 'aos';
import { forkJoin, Observable, tap } from 'rxjs';
import { GetPhoto, GetPost, PostService, ProductTypes,} from '../../shared/services/post.service';
import Swal from 'sweetalert2';
import { AddPostComponent } from "../add-post/add-post.component";
import { ReviewsComponent } from "./reviews/reviews.component";
import { AppUrl } from '../../shared/AppUrl/AppUrl';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import { AdditionalParamsComponent } from '../../shared/components/additional-params/additional-params.component';

@Component({
  selector: 'app-edit-post',
  imports: [CommonModule, FormsModule, ɵEmptyOutletComponent, AddPostComponent, ReviewsComponent, AdditionalParamsComponent],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss',
})
export class EditPostComponent {
  AppUrl = AppUrl;
  postId: number = 0;
  posts: GetPost = {} as GetPost;
  photosArray: GetPost[] = [];
  InsertPhotos: Insertphoto[] = [];
  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router) {
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
      window.scrollTo({
     top: 0,
     behavior: 'smooth' 
   });
  }

  oldPost!:InsertPost;

  getPost() {
    this.oldPost as {};
    this.postService.getPostWithId(this.postId).subscribe((resp) => {
      this.posts = resp;
      this.title = this.posts.title;
      this.description = this.posts.description;
      this.productTypeId = this.posts.productTypeId;
      this.price = this.posts.price;
      this.discountedPrice = this.posts.discountedPrice;
      this.photos = this.posts.photos;
      this.uploadPhotos = this.photos.map(item => ({
        id: item.photoId!,                   
        preview: item.photoUrl ?? null, 
        file: null
      }));
      this.oldPost = {
        Id: resp.postId,
        title: resp.title,
        productTypeId: resp.productTypeId,
        price: resp.price,
        discountedPrice: resp.discountedPrice,
        description: resp.description,
        photos:null,
      };
      this.quantity = this.posts.quantity;
      this.quantityRollback=resp.quantity;
      if (this.posts.discountedPrice != null &&this.posts.discountedPrice > 0) {
        this.discountAmountChangeDetection();
      }
    });
  }
    title: string = '';
    productTypeId: number |null= 0;
    price!: number;
    discountedPrice!: number;
    description: string = '';
    quantity!: number;
    quantityRollback: number=0;
    photos: GetPhoto[] = [];



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
 photosChanged():boolean{
  return this.uploadPhotos.some(p => p.file);
}

ValidateAndSaveEditedProduct() {
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
  this.submitPost();
}

SavePhotos() {
  const formData = new FormData();
  for (let p of this.uploadPhotos) {
    if (p.file) {
      formData.append('postId', this.postId.toString()); 
      formData.append('photos', p.file); 
    }
  }
  this.postService.EditPostPhotos(formData).subscribe({
    next: (res) => {
      if (res != null) {
          Swal.fire({
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonText: 'ოქეი',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            confirmButtonColor: 'green',
            title: 'პროდუქტი წარმატებით რედაქტირდა!',

          });
        }
        this.hideEditProduct();
        this.changeNum=0;
        this.getPost();
    },
    error: (err) => {
      console.error(err);
    }
  });
}

private submitPost() {
  const InsertPost: InsertPost = {
    Id: this.postId,
    title: this.title,
    productTypeId: this.productTypeId,
    price: this.price,
    discountedPrice: this.discountedPrice,
    description: this.description,
    photos:null,
  };

  this.postService.EditPost(InsertPost).subscribe(
    (resp) => {
      if (resp != null) {
        Swal.fire({
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: 'green',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          title:'პროდუქტი წარმატებით რედაქტირდა',
        });
        this.changeNum = 0;
        this.hideEditProduct();
        this.oldPost = {
            Id: this.postId,
            title: this.title,
            productTypeId: this.productTypeId,
            price: this.price,
            discountedPrice: this.discountedPrice,
            description: this.description,
            photos:null,
        };
      }
    },
    (error) => {
      console.error(error);
    }
  );
}
  changeNum:number = 0;

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
      this.changeNum ++; 
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
      background:'rgb(25, 26, 25)',
      color: '#ffffff',      
      confirmButtonColor: 'green',
      title: 'ნამდვილად გსურთ ფოტოს წაშლა?',
    }).then((results) => {
     if (results.isConfirmed) {

      const photoToDelete = this.uploadPhotos.find(p => p.id === id);

      if (!photoToDelete) {
        console.error('Photo not found');
        return;
      }

      if (photoToDelete.file) {
        this.uploadPhotos = this.uploadPhotos.filter(p => p.id !== id);
        this.uploadPhotosTobackend = this.uploadPhotosTobackend.filter(p => p.id !== id);
        if (this.changeNum > 0) {
          this.changeNum--;
        }
        return;
      }

      if (!photoToDelete.preview || typeof photoToDelete.preview !== 'string') {
        console.error('Preview is missing or invalid');
        return;
      }

      this.postService.deletePhoto(id, photoToDelete.preview).subscribe({
        next: (resp) => {
          this.uploadPhotos = this.uploadPhotos.filter(p => p.id !== id);
          this.uploadPhotosTobackend = this.uploadPhotosTobackend.filter(p => p.id !== id);

          if (this.changeNum > 0) {
            this.changeNum--;
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'ფოტოს წაშლა ვერ მოხერხდა',
          });
        }
      });
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

  deleteProductPermanently(){
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'გაუქმება',
      cancelButtonColor: 'green',
      confirmButtonText: 'დიახ, წაშლა',
      confirmButtonColor: 'red',
      background:'rgb(25, 26, 25)',
      color: '#ffffff',
      icon: 'warning',
      title: 'გაითვალისწინე',
      text: 'პროდუქტი და ყველა მასთან დაკავშირებული შეკვეთა სამუდამოდ წაიშლება!',
    }).then((results) => {
      if (!results.isConfirmed) return;

      this.postService.DeleteProductPermanently(this.postId).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'პროდუქტი წარმატებით წაიშალა',
          });
          this.router.navigate([AppRoutes.posts]);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'პროდუქტის წაშლა ვერ მოხერხდა',
          });
        }
      });
    });
  }
  orderAllowedToggle(){
    var allowed = false;
    if(this.posts.orderNotAllowed){
      allowed = false;
    }
    else{
      allowed = true;
    }
    this.posts.orderNotAllowed = allowed;
      this.postService.UpdateProductOrderAllowed(this.posts.id,allowed).subscribe(
        (resp)=>{
          console.log(resp);
    })
  }


  editQuantityVisible:boolean = false;
  editQuantity(){
    this.editQuantityVisible = true;
  }

  saveQuantity(){
    if(this.quantity>=0){
      this.postService.UpdateQuantity(this.postId, this.quantity).subscribe(
        (resp)=>{
          Swal.fire({
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            confirmButtonColor: 'green',
            background:'rgb(25, 26, 25)',
            color: '#ffffff',
            title:'მარაგი წარმატებით განახლდა!',
          });
          this.closeQuantity();
        }
      )
    }
    else{
        Swal.fire({
          icon: 'error',
          timer: 3000,
          showConfirmButton: false,
          confirmButtonColor: 'green',
          background:'rgb(25, 26, 25)',
          color: '#ffffff',
          title:'მარაგი არ შეიძლბა იყოს 0-ზე ცოტა!',
        });
    }
  }
  closeQuantityEdit(){
    this.editQuantityVisible = false;
    this.quantity = this.quantityRollback;
  }
  closeQuantity(){
    this.editQuantityVisible = false;
  }
  editProductVisible:boolean = false;
  rollbackProduct(){
      this.title = this.oldPost.title;
      this.description = this.oldPost.description;
      this.productTypeId = this.oldPost.productTypeId;
      this.price = this.oldPost.price;
      this.discountedPrice = this.oldPost.discountedPrice;
    
    this.editProductVisible = false;
  }
  hideEditProduct(){
    this.editProductVisible = false;
  }
  editProduct(){
    this.editProductVisible = true;
  }


  copiedNumber:number= 0;
  copyToClipboard(text: string,numebr:number): void {
    this.copiedNumber = numebr;
    navigator.clipboard.writeText(text)
    .then(() => {
    })
    .catch(err => {
    });
    setTimeout(() => {
      this.copiedNumber = 0;
    }, 3000);
  }
}

export interface InsertPost {
  Id?:number;
  title: string;
  productTypeId: number|null;
  description: string;
  price: number;
  discountedPrice: number;
  photos: Insertphoto[]|null;
}
export interface Insertphoto {
  photoUrl: string;
}
