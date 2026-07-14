import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PostService, Shop } from '../../shared/services/post.service';
import { forkJoin, Observable, tap } from 'rxjs';
import { Insertphoto } from '../edit-post/edit-post.component';
import Swal from 'sweetalert2';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import { RouterLink } from '@angular/router';
import { AuthReloadService } from '../../shared/AuthReloadServise/AuthReloadService';
import { AppUrl } from '../../shared/AppUrl/AppUrl';
@Component({
  selector: 'app-profile',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  AppUrl = AppUrl;
  AppRoutes=AppRoutes;
  shop: Shop = {
    id: 0,
    name: '',
    logo: null,
    location: null,
    gmail: '',
    subscription: '',
    instagram: null,
    facebook: null,
    titkok: null,
    bog: null,
    tbc: null,
    receiver: null,
    mobileNumber: null,
  };

  shopStats: ShopStats={
    productCount :'',
    followerCount :'',
  };
  oldShopObject!:Shop;
   
    constructor(private service:PostService,private AuthReloadService:AuthReloadService){
      this.loadShop();
      this.getShopStats();
    }

  ngOnInit(): void {
   window.scrollTo({
     top: 0,
     behavior: 'smooth' 
   });
  }
  
  shopId:number = 0;
  loadShop(): void {
    this.service.getShopById().subscribe({
      next: (data: Shop) => {
        this.shop = { ...data };        
        this.shopId = this.shop.id;
        this.oldShopObject = { ...data }; 
        if(this.shop.logo){
          this.preview = this.shop.logo;
        }
        localStorage.setItem('subPlan',this.shop.subscription)
      },
    });
  }

  getShopStats(): void {
    this.service.getShopStats().subscribe(
     (resp) => {
        this.shopStats = resp;
      },
    );
  }

  RollBack(): void {
    this.shop = { ...this.oldShopObject };
  }

  savePhotoVisible:boolean = false;
  showSavePhoto(){
    this.savePhotoVisible = true;
   this.triggerFileInput();
  }
  hideSavePhoto(){
    this.savePhotoVisible = false;
    this.preview = this.shop.logo;
  }
  
  uploadPhoto: {
    id: number;
    file: File;
    preview: string | ArrayBuffer | null;
  } | null = null;


  insertPhoto: Insertphoto | null = null;

  triggerFileInput(): void {
    const fileInput = document.getElementById('photoinput') as HTMLInputElement;
    fileInput.click();
  }
  preview: string | null = null; 
  onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    const newPhoto = {
      id: Date.now(),
      file: file,
      preview: null as string | null
    };

    this.showSavePhoto();

    const reader = new FileReader();
    reader.onload = () => {
      newPhoto.preview = reader.result as string;
      this.uploadPhoto = newPhoto;
      this.preview = newPhoto.preview;
    };
    reader.readAsDataURL(file);
      input.value = '';
    }
}


SavePhotos() {
  const formData = new FormData();
  if(this.uploadPhoto){
    formData.append('photo', this.uploadPhoto.file); 
    this.service.EditShopPhoto(formData).subscribe({
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
              this.savePhotoVisible = false;
              this.AuthReloadService.reafresh()
          }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}


uploadPhotoToServer() {
  if (!this.uploadPhoto?.file) {
    throw new Error('No photo selected!');
  }

}


  uploadMessage(message: string){
    Swal.fire({
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        confirmButtonColor: 'green',
        background:'rgb(25, 26, 25)',
        color: '#ffffff',
        title:message,
    });
    this.savePhotoVisible = false;
  }

  UpdateShop(){
    this.service.UpdateShop(this.shop).subscribe(
      (resp)=>{
        if(resp){
          this.uploadMessage('პროფილი წარმატებით რედაქტირდა');
          this.AuthReloadService.reafresh();
        }
      }
    )
  }

  fieldseditPermission: boolean = false;
  modifyFields(){
    this.fieldseditPermission = true;
  }
  saveFields(){
    this.fieldseditPermission = false;
    this.UpdateShop();
  }
  cancelFields(){
    this.fieldseditPermission = false;
    this.RollBack();
  }

  logout(){
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'არა',
      cancelButtonColor: 'red',
      confirmButtonText: 'დიახ',
      background:'rgb(25, 26, 25)',
      color: '#ffffff',      
      confirmButtonColor: 'green',
      title: 'ნამდვილად გსურთ აქაუნთიდან გასვლა?',
    }).then((results) => {
      if (results.isConfirmed) {
        localStorage.removeItem('token');
        this.AuthReloadService.reafresh();
      }
    });
  }
}
export interface ShopStats{
  followerCount:string;
  productCount:string;
}