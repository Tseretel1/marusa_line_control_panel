import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PhotoAlbumComponent } from '../../shared/components/photo-album/photo-album.component';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../shared/AppRoutes/AppRoutes';
import * as AOS from 'aos'
import { GetPost, PostService } from '../../shared/services/post.service';

@Component({
  selector: 'app-posts',
  imports: [CommonModule, PhotoAlbumComponent, RouterLink],
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
  }
  

  getPostsDto:getPosts={
    IsDeleted : false,
    PageNumber : 1,
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
        if(!this.getPostsDto.IsDeleted){
          this.totalCount = this.posts[0].totalActiveProducts;
        }
        else{
          this.totalCount = this.posts[0].totalDeletedProducts;
        }
        this.totalPages = Math.ceil(this.totalCount / this.getPostsDto.PageSize);
        this.lastPage = Math.ceil(this.totalCount / this.getPostsDto.PageSize);
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

  get ActivePosts(){
    return this.posts.filter((x)=> x.dateDeleted == null ).length;
  }
  get HiddenPosts(){
    return this.posts.filter((x)=> x.dateDeleted != null ).length;
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
}

export interface getPosts{
  IsDeleted:boolean;
  PageNumber:number;
  PageSize:number;
}
