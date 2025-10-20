import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../AppRoutes/AppRoutes';
import { GetPost } from '../../services/post.service';
@Component({
  selector: 'app-photo-album',
  imports: [CommonModule,RouterLink],
  templateUrl: './photo-album.component.html',
  styleUrl: './photo-album.component.scss'
})
export class PhotoAlbumComponent implements OnInit{
  @Input() posts!:GetPost;
  AppRoutes = AppRoutes;
  ngOnInit(): void {
    console.log(this.posts)
  }
}
