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
  
  AppRoutes=AppRoutes;
  posts: GetPost[] = [];
  likeCount:number = 0;
  constructor(private postService:PostService){
    this.postService.getPosts().subscribe(
      (resp)=>{
        this.posts = resp;
      }
    )
    this.postService.getTotalLikesCount().subscribe(
      (resp)=>{
        this.likeCount = resp;
      }
    )
  }
  ngOnInit(): void {
    AOS.init({
      duration: 300,
      easing: 'ease-in-out',
      once: false, 
    });
  }
}
