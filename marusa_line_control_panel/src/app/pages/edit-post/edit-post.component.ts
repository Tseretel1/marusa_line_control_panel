import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as AOS from 'aos'
import { forkJoin, Observable, tap } from 'rxjs';
import { PostService } from '../../shared/services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-post',
  imports: [CommonModule,FormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss'
})
export class EditPostComponent {
  postId: number = 0;
  constructor(private route: ActivatedRoute,private postService: PostService){
    this.route.paramMap.subscribe(params => {
    this.postId = Number(params.get('id'));
  });
}
  photoId:number = 1;
   ngOnInit(): void {
    AOS.init({
      duration: 500,
      easing: 'ease-in-out',
      once: false, 
    });
    this.getPost();
    this.discountAmountChangeDetection();
  }
  photosToDisplay:photo []=[
    {
      photoUrl:'https://breakingwoodprojects.com/cdn/shop/files/Olivewoodblackepoxychessboard2.webp?v=1691511960'
    },
    {
      photoUrl:'https://www.okobojitradingcompany.com/cdn/shop/products/20230221_130600_1024x1024@2x.jpg?v=1677090245'
    },
    {
      photoUrl:'https://southernrivertables.com/cdn/shop/products/IMG_9028.jpg?v=1680885753'
    },
    {
      photoUrl:'https://i.pinimg.com/736x/09/da/d7/09dad7ac662f0fb5a6a5cfa661ac4eef.jpg'
    },
    {
      photoUrl:'https://i.etsystatic.com/29248907/r/il/031184/5052730250/il_570xN.5052730250_org8.jpg'
    },
    {
      photoUrl:'https://i.etsystatic.com/29248907/r/il/b765ea/5590656690/il_fullxfull.5590656690_knbt.jpg'
    },
  ];

  insertPost:InsertPost={
    title : 'ჭადრაკი',
    productType : 'ჭადრაკი',
    description : 'ჭადრაკი — ინტელექტუალური თამაში, რომელშიც ორგანულადაა შერწყმული ხელოვნების, მეცნიერებისა და სპორტის ელემენტები. ჭადრაკი ხელს უწყობს აზროვნების, ლოგიკის, ყურადღების კონცენტრაციის, თვითკრიტიკის განვითარებას, გამარჯვებისაკენ სწრაფვას და სხვა. ჭადრაკის თამაშში მკაფიოდ ვლინდება პიროვნების ხასიათის ინდივიდუალური თავისებურებანი. ჭადრაკის პარტიას თამაშობს ორი პარტნიორი („თეთრი“ და „შავი“ ფიგურებით) კვადრატული, მუქი და ღია ფერის 64-უჯრედიან დაფაზე (ქვემო ნათელი უჯრედი მოთამაშის მარჯვენა მხარეს უნდა იყოს). ყოველ პარტნიორს აქვს 16 ფიგურა (მეფე, ლაზიერი, 2 ეტლი, 2 მხედარი, 2 კუ და 8 პაიკი).',
    price : 100,
    discountedPrice : 80,
    quantity : 3,
    photos : this.photosToDisplay,
  }

  getPost(){
    this.title = this.insertPost.title;
    this.description = this.insertPost.description;
    this.productType = this.insertPost.productType;
    this.price = this.insertPost.price;
    this.discountedPrice = this.insertPost.discountedPrice;
    this.photos = this.insertPost.photos;
    this.uploadPhotos.forEach((item, index) => {
      if (this.photos[index]) {
        item.preview = this.photos[index].photoUrl;
      }
    });
    this.quantity = this.insertPost.quantity;
  }
    title:string = '';
    productType:string = '';
    price!:number;
    discountedPrice!:number;
    description:string = '';
    quantity!:number;
    photos:photo [] = [];

  validatedata():any{
    if(this.title!='' && this.productType!='' && this.price!=0){
      const InsertPost : InsertPost = {
        title:this.title,
        productType:this.productType,
        price:this.price,
        discountedPrice:this.discountedPrice,
        description:this.description,
        quantity:this.quantity,
        photos:this.photos,
      } 
      return InsertPost;
    }
    return null;
  }

      
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
  
  discountedPercentage:number =0;  
  discountAmountChangeDetection(){
    this.discountedPercentage = ((this.price - this.discountedPrice) / this.price) * 100;
    this.discountedPercentage = Math.round(this.discountedPercentage);
  }
    removePhoto(id: number) {
      Swal.fire({
          showConfirmButton:true,
          showCancelButton:true,
          cancelButtonText:'არა',
          cancelButtonColor:'red',
          confirmButtonText: 'დიახ',
          confirmButtonColor:'green',
          title:'ნამდვილად გსურთ ფოტოს წაშლა?',
        }).then((results)=>{
          if(results.isConfirmed){
            const photo = this.uploadPhotos.find(p => p.id === id);
            if (photo) {
              photo.file = null;
              photo.preview = null;
            }
          }
      })
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

