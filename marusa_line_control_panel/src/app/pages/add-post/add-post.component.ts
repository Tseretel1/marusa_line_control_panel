import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos'
import { Posts } from '../posts/posts.component';
import { Observable, forkJoin, tap,} from 'rxjs';
import { PostService } from '../../shared/services/post.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-add-post',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss'
})


export class AddPostComponent implements OnInit{

  constructor(private postService:PostService,){
  }

  ngOnInit(): void {
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
      once: false, 
    });
  }

  title:string = '';
  productType:string = '';
  price!:number;
  discountedPrice!:number;
  description:string = '';
  quantity!:number;
  photos:photo [] = [];
    
  sendApplicationtoBackend() {
    if (this.title && this.productType && this.price > 0) {
      this.uploadAllImages().subscribe({
        next: (results) => {
          const InsertPost: InsertPost = {
            title: this.title,
            productType: this.productType,
            price: this.price,
            discountedPrice: this.discountedPrice,
            description: this.description,
            quantity: this.quantity,
            photos: this.photos 
          };
          Swal.fire({
            icon:'success',
            timer:3000,
            showConfirmButton:true,
            confirmButtonText: 'ოქეი',
            confirmButtonColor:'green',
            title:'პოსტი წარმატებით დაემატა!',
          }).then((results)=>{
            window.location.reload();
          })
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          console.log("Ready to send:", InsertPost);
        },
        error: (err) => {
          console.error("Upload failed:", err);
        }
      });
    } 
    else {
      console.warn("Validation failed!");
    }
  }

  uploadPhotos: { id: number; preview?: string | ArrayBuffer | null; file?: File | null }[] = [
    { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }
  ];

  triggerFileInput(index: number): void {
    const fileInput = document.getElementById('photo-' + index) as HTMLInputElement;
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

  removePhoto(id: number) {
    const photo = this.uploadPhotos.find(p => p.id === id);
    if (photo) {
      photo.file = null;
      photo.preview = null;
    }
  }

  uploadAllImages(): Observable<any[]> {
    const uploads: Observable<any>[] = [];
    this.uploadPhotos.forEach((p, index) => {
      if (p.file) {
        const upload$ = this.postService.uploadImage(p.file).pipe(
          tap((response: any) => {
            this.photos.push(response.secure_url);
          })
        );
        uploads.push(upload$);
      }
    });
    return forkJoin(uploads);
  }
 discountedPercentage:number =0;  
  discountAmountChangeDetection(){
    this.discountedPercentage = ((this.price - this.discountedPrice) / this.price) * 100;
    this.discountedPercentage = Math.round(this.discountedPercentage);
  }
}


export interface InsertPost{
  title:string;
  productType:string;
  description:string;
  price:number;
  discountedPrice:number;
  quantity:number;
  photos:photo[];
}
export interface photo{
  photoUrl:string;
}
