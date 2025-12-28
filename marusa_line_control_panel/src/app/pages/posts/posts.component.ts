import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PhotoAlbumComponent } from '../../shared/components/photo-album/photo-album.component';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import * as AOS from 'aos'
import { GetPost, PostService, ProductTypes } from '../../shared/services/post.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ReturnStatement } from '@angular/compiler';
@Component({
  selector: 'app-posts',
  imports: [CommonModule, PhotoAlbumComponent, RouterLink, FormsModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit{

    ngOnInit(): void {
    AOS.init({
      duration: 300,
      easing: 'ease-in-out',
      once: false, 
    });
    this.getActivePosts();
    this.getProductTypes();
  }
  

  getPostsDto:getPosts={
    IsDeleted : false,
    PageNumber : 1,
    ProductTypeId : null,
    PageSize : 10,
  }

  AppRoutes=AppRoutes;
  posts: GetPost[] = [];
  likeCount:number = 0;
  constructor(private postService:PostService){
    this.postService.getTotalLikesCount().subscribe(
      (resp)=>{
        this.likeCount = resp;
      }
    )
  }

  totalCount:number = 0;
  getPosts(){
    this.postService.getPosts(this.getPostsDto).subscribe(
      (resp)=>{
        this.posts = resp;
        if(!resp){
          this.posts=[];
          return;
        }
        else{
          if(!this.getPostsDto.IsDeleted){
            this.totalCount = this.posts[0].totalActiveProducts;
          }
          else{
            this.totalCount = this.posts[0].totalDeletedProducts;
          }
          this.totalPages = Math.ceil(this.totalCount / this.getPostsDto.PageSize);
          this.lastPage = Math.ceil(this.totalCount / this.getPostsDto.PageSize);
        }
      }
    )
  }
  getActivePosts(){
    this.getPostsDto.IsDeleted = false;
    this.getPostsDto.PageNumber = 1;
    this.selectedPage = 1;
    this.pageNumber = 1;
    this.getPosts();
  }
  getDeletedPosts(){
    this.getPostsDto.IsDeleted = true;
    this.getPostsDto.PageNumber = 1;
    this.selectedPage = 1;
    this.pageNumber = 1;
    this.getPosts();
  }

  GetByCategorie(id:number|null){
    if(id==null){
      this.getPostsDto.ProductTypeId = null;
      this.activeFilterNum = 0;
    }
    else{
      this.getPostsDto.ProductTypeId= id;
      this.activeFilterNum = id;
    }
    this.getPosts();
  }

  get ActivePosts(){
    return this.posts.filter((x)=> x.dateDeleted == null ).length;
  }
  get HiddenPosts(){
    return this.posts.filter((x)=> x.dateDeleted != null ).length;
  }


 activeFilterNum: number = 0;

  typeManagementVisible:boolean = false;
  toggleTypemnagement(b:boolean){
    this.typeManagementVisible = b;
  }

  lastPage: number = 0; 
  selectedPage: number = 1;
  pageNumber: number = 1;
  changePage(page: number) {
    if (page < 1 || page > this.lastPage) return;
    this.selectedPage = page;
    this.getPostsDto.PageNumber = page;
    const middle = this.pageNumber + 2;
    if (page > middle) {
      this.pageNumber = page - 2;
    } else if (page < middle && this.pageNumber > 1) {
      this.pageNumber = Math.max(1, page - 2);
    }
    localStorage.setItem('PageNumber', this.selectedPage.toString());
    this.getPosts();
  }
 
  totalPages:number =0;
  productTypesList :ProductTypes[]= [];
  getProductTypes(){
    this.postService.getProductTypes().subscribe(
      (resp)=>{
        this.productTypesList = resp;
      }
    )
  }

  TypeString :string = '';
  AddType :string = '';
  TypeToeditNum:number = 0;
  openTypeToEdit(num:number){
    this.TypeToeditNum = num;
    const typeName = this.productTypesList.find(x=>x.id == num);
    if(typeName){
      this.TypeString = typeName.productType;
    }
  }
  hideTypeToEdit(){
    this.TypeToeditNum = 0;
  }
  insertProductTypes(){
  this.postService.InsertProductTypes(this.AddType).subscribe(
    (resp)=>{
      this.productTypesList =resp.productTypes;
      this.AddType = '';
    })
  }
  editProductTypes(){
  if(this.TypeString!=''){
    this.postService.EditProductTypes(this.TypeToeditNum,this.TypeString).subscribe(
      (resp)=>{
          const typeName = this.productTypesList.find(x=>x.id == this.TypeToeditNum);
          if(typeName){
          typeName.productType = this.TypeString;
          this.hideTypeToEdit()
          }
      })
    }
  }
  removeTypeCompletely(id: number) {
    Swal.fire({
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'არა',
      cancelButtonColor: 'red',
      confirmButtonText: 'დიახ',
      confirmButtonColor: 'green',
      background:'rgb(25, 26, 25)',
      color: '#ffffff',  
      title: 'ნამდვილად გსურთ კატეგორიის წაშლა?',
      
    }).then((results) => {
      if (results.isConfirmed) {
        this.postService.DeleteProductTypes(id).subscribe((resp) => {
          this.productTypesList = resp.productTypes;
        });
      }
    });
  }
}

export interface getPosts{
  ProductTypeId:number|null;
  IsDeleted:boolean;
  PageNumber:number;
  PageSize:number;
}
