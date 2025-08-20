import { Component, Input } from '@angular/core';
import { Posts } from '../../../pages/posts/posts.component';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-photo-album',
  imports: [CommonModule],
  templateUrl: './photo-album.component.html',
  styleUrl: './photo-album.component.scss'
})
export class PhotoAlbumComponent {
 @Input() photos!:Posts;
}
