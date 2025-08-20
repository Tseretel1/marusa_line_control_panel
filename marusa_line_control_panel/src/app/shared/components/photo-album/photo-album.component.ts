import { Component, Input } from '@angular/core';
import { Posts } from '../../../pages/posts/posts.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../AppRoutes/AppRoutes';
@Component({
  selector: 'app-photo-album',
  imports: [CommonModule,RouterLink],
  templateUrl: './photo-album.component.html',
  styleUrl: './photo-album.component.scss'
})
export class PhotoAlbumComponent {
  AppRoutes=AppRoutes;
 @Input() photos!:Posts;
}
