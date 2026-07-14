import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PhotoAlbumComponent } from '../../shared/components/photo-album/photo-album.component';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import * as AOS from 'aos'
import { GetPost, PostService, ProductTypes, SearchProductsDto, SearchProductsResult } from '../../shared/services/post.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { ReturnStatement } from '@angular/compiler';
import { Subject, of, switchMap } from 'rxjs';
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
    this.getPostsMainMethod();
    this.getProductTypes();

    this.searchSubject.pipe(
      switchMap(term => {
        const trimmed = term.trim();
        if(!trimmed){
          this.isSearching = false;
          return of(null);
        }
        this.isSearching = true;
        this.activeFilterNum = 0;
        this.getPostsDto.ProductTypeId = null;
        return this.executeSearch(trimmed, 1);
      })
    ).subscribe(resp => {
      if(resp === null){
        this.getPostsMainMethod();
        return;
      }
      this.selectedPage = 1;
      this.pageNumber = 1;
      this.applySearchResults(resp);
    });
  }

  searchTerm: string = '';
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();

  onSearchInput(value: string){
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  private getShopIdFromToken(): number {
    const token = localStorage.getItem('token');
    if(!token) return 0;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Number(payload['ShopId'] ?? 0);
    } catch {
      return 0;
    }
  }

  private executeSearch(term: string, page: number){
    const dto: SearchProductsDto = {
      userId: 0,
      shopId: this.getShopIdFromToken(),
      searchTerm: term,
      pageNumber: page,
      pageSize: this.getPostsDto.PageSize,
    };
    return this.postService.searchProducts(dto);
  }

  private applySearchResults(resp: SearchProductsResult){
    this.posts = resp.products.map(p => ({
      ...p,
      photos: [],
      dateDeleted: null,
      totalActiveProducts: resp.totalCount,
      totalDeletedProducts: 0,
    }));
    this.totalCount = resp.totalCount;
    this.totalPages = Math.ceil(this.totalCount / this.getPostsDto.PageSize);
    this.lastPage = Math.ceil(this.totalCount / this.getPostsDto.PageSize);
  }

  getPostsMainMethod(){
    const categoryId = localStorage.getItem('ProductsCategoryId');
    this.getPostsDto.ProductTypeId = categoryId && categoryId !== 'null' ? Number(categoryId) : null;
    this.activeFilterNum = this.getPostsDto.ProductTypeId ?? 0;

    const isDeleted = localStorage.getItem('ProductsIsDeleted');
    if(isDeleted === 'true'){
      this.getDeletedPosts();
      return;
    }
    this.getActivePosts();
  }


  getPostsDto:getPosts={
    IsDeleted : false,
    PageNumber : 1,
    ProductTypeId : null,
    PageSize : 30,
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
    this.isSearching = false;
    const pageNum = localStorage.getItem('ProductsPageNumber');
    if(pageNum){
      this.selectedPage = Number(pageNum);
      this.getPostsDto.PageNumber = Number(pageNum);
    }
    this.postService.getPosts(this.getPostsDto).subscribe(
      (resp)=>{
        this.posts = resp;
        if(!resp){
          this.posts=[];
          localStorage.removeItem('ProductsPageNumber');
          this.getPostsDto.PageNumber = 1;
          this.selectedPage = 1;
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
    this.searchTerm = '';
    this.getPostsDto.IsDeleted = false;
    this.getPostsDto.PageNumber = 1;
    this.selectedPage = 1;
    this.pageNumber = 1;
    localStorage.setItem('ProductsIsDeleted', 'false');
    this.getPosts();
  }
  getDeletedPosts(){
    this.searchTerm = '';
    this.getPostsDto.IsDeleted = true;
    this.getPostsDto.PageNumber = 1;
    this.selectedPage = 1;
    this.pageNumber = 1;
    localStorage.setItem('ProductsIsDeleted', 'true');
    this.getPosts();
  }

  GetByCategorie(id:number|null){
    this.searchTerm = '';
    if(id==null){
      this.getPostsDto.ProductTypeId = null;
      this.activeFilterNum = 0;
      localStorage.setItem('ProductsCategoryId', 'null');
    }
    else{
      this.getPostsDto.ProductTypeId= id;
      this.activeFilterNum = id;
      this.getPostsDto.PageNumber=1;
      this.selectedPage = 1;
      localStorage.setItem('ProductsCategoryId', id.toString());
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
    if(this.isSearching){
      this.executeSearch(this.searchTerm.trim(), page).subscribe(resp => this.applySearchResults(resp));
      return;
    }
    localStorage.setItem('ProductsPageNumber', this.selectedPage.toString());
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
